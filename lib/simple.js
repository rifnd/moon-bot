const {
    default: makeWASocket,
    makeWALegacySocket,
    extractMessageContent,
    makeInMemoryStore,
    proto,
    prepareWAMessageMedia,
    downloadContentFromMessage,
    getBinaryNodeChild,
    jidDecode,
    areJidsSameUser,
    generateWAMessage,
    generateForwardMessageContent,
    generateWAMessageFromContent,
    getContentType,
    WAMessageStubType,
    WA_DEFAULT_EPHEMERAL,
} = require('@whiskeysockets/baileys')
const {
    toAudio,
    toPTT,
    toVideo
} = require('./converter')
const chalk = require('chalk')
const fetch = require("node-fetch")
const FileType = require('file-type')
const PhoneNumber = require('awesome-phonenumber')
const fs = require('fs')
const axios = require('axios')
const path = require('path')
const pino = require('pino')
const util = require('util')
const {
    imageToWebp,
    videoToWebp,
    writeExifImg,
    writeExifVid
} = require('./exif')
const store = makeInMemoryStore({
    logger: pino().child({
        level: 'silent',
        stream: 'store'
    })
})

exports.makeWASocket = (connectionOptions, options = {}) => {
    let conn = (opts['legacy'] ? makeWALegacySocket : makeWASocket)(connectionOptions)

    // conn.ws.on('CB:stream:error', (stream) => {
    //     const { code } = stream || {}
    //     if (code == '401') conn.ev.emit('connection.update', {
    //         connection: 'logged Out',
    //         lastDisconnect: {
    //             error: {
    //                 output: {
    //                     statusCode: DisconnectReason.loggedOut
    //                 }
    //             },
    //             date: new Date()
    //         }
    //     })
    // })
    conn.decodeJid = (jid) => {
        if (!jid) return jid
        if (/:\d+@/gi.test(jid)) {
            const decode = jidDecode(jid) || {}
            return decode.user && decode.server && decode.user + '@' + decode.server || jid
        } else return jid
    }
    if (conn.user && conn.user.id) conn.user.jid = conn.decodeJid(conn.user.id)
    if (!conn.chats) conn.chats = {}

    function updateNameToDb(contacts) {
        if (!contacts) return
        for (const contact of contacts) {
            const id = conn.decodeJid(contact.id)
            if (!id) continue
            let chats = conn.chats[id]
            if (!chats) chats = conn.chats[id] = {
                id
            }
            conn.chats[id] = {
                ...chats,
                ...({
                    ...contact,
                    id,
                    ...(id.endsWith('@g.us') ? {
                        subject: contact.subject || chats.subject || ''
                    } : {
                        name: contact.notify || chats.name || chats.notify || ''
                    })
                } || {})
            }
        }
    }


    conn.ev.on('contacts.upsert', updateNameToDb)
    conn.ev.on('groups.update', updateNameToDb)
    conn.ev.on('chats.set', async ({
        chats
    }) => {
        for (const {
            id,
            name,
            readOnly
        }
            of chats) {
            id = conn.decodeJid(id)
            if (!id) continue
            const isGroup = id.endsWith('@g.us')
            let chats = conn.chats[id]
            if (!chats) chats = conn.chats[id] = {
                id
            }
            chats.isChats = !readOnly
            if (name) chats[isGroup ? 'subject' : 'name'] = name
            if (isGroup) {
                const metadata = await conn.groupMetadata(id).catch(_ => null)
                if (!metadata) continue
                chats.subject = name || metadata.subject
                chats.metadata = metadata
            }
        }
    })
    conn.ev.on('group-participants.update', async function updateParticipantsToDb({
        id,
        participants,
        action
    }) {
        id = conn.decodeJid(id)
        if (!(id in conn.chats)) conn.chats[id] = {
            id
        }
        conn.chats[id].isChats = true
        const groupMetadata = await conn.groupMetadata(id).catch(_ => null)
        if (!groupMetadata) return
        conn.chats[id] = {
            ...conn.chats[id],
            subject: groupMetadata.subject,
            metadata: groupMetadata
        }
    })

    conn.ev.on('groups.update', async function groupUpdatePushToDb(groupsUpdates) {
        for (const update of groupsUpdates) {
            const id = conn.decodeJid(update.id)
            if (!id) continue
            const isGroup = id.endsWith('@g.us')
            if (!isGroup) continue
            let chats = conn.chats[id]
            if (!chats) chats = conn.chats[id] = {
                id
            }
            chats.isChats = true
            const metadata = await conn.groupMetadata(id).catch(_ => null)
            if (!metadata) continue
            chats.subject = metadata.subject
            chats.metadata = metadata
        }
    })
    conn.ev.on('chats.upsert', async function chatsUpsertPushToDb(chatsUpsert) {
        console.log({
            chatsUpsert
        })
        const {
            id,
            name
        } = chatsUpsert
        if (!id) return
        let chats = conn.chats[id] = {
            ...conn.chats[id],
            ...chatsUpsert,
            isChats: true
        }
        const isGroup = id.endsWith('@g.us')
        if (isGroup) {
            const metadata = await conn.groupMetadata(id).catch(_ => null)
            if (metadata) {
                chats.subject = name || metadata.subject
                chats.metadata = metadata
            }
            const groups = await conn.groupFetchAllParticipating().catch(_ => ({})) || {}
            for (const group in groups) conn.chats[group] = {
                id: group,
                subject: groups[group].subject,
                isChats: true,
                metadata: groups[group]
            }
        }
    })
    conn.ev.on('presence.update', async function presenceUpdatePushToDb({
        id,
        presences
    }) {
        const sender = Object.keys(presences)[0] || id
        const _sender = conn.decodeJid(sender)
        const presence = presences[sender]['lastKnownPresence'] || 'composing'
        let chats = conn.chats[_sender]
        if (!chats) chats = conn.chats[_sender] = {
            id: sender
        }
        chats.presences = presence
        if (id.endsWith('@g.us')) {
            let chats = conn.chats[id]
            if (!chats) {
                const metadata = await conn.groupMetadata(id).catch(_ => null)
                if (metadata) chats = conn.chats[id] = {
                    id,
                    subject: metadata.subject,
                    metadata
                }
            }
            chats.isChats = true
        }
    })

    conn.logger = {
        ...conn.logger,
        info(...args) {
            console.log(chalk.bold.rgb(57, 183, 16)(`INFO [${chalk.rgb(255, 255, 255)(new Date())}]:`), chalk.cyan(util.format(...args)))
        },
        error(...args) {
            console.log(chalk.bold.rgb(247, 38, 33)(`ERROR [${chalk.rgb(255, 255, 255)(new Date())}]:`), chalk.rgb(255, 38, 0)(util.format(...args)))
        },
        warn(...args) {
            console.log(chalk.bold.rgb(239, 225, 3)(`WARNING [${chalk.rgb(255, 255, 255)(new Date())}]:`), chalk.keyword('orange')(util.format(...args)))
        }
    }

    const _0x1beedc = _0x566d; function _0x5439() { const _0x2749ba = ['614050geQehy', '477676XvIruf', 'efoxH', '1513794bUTfAM', '4378TzzPbJ', 'key', 'contextInf', 'then', '2254856ijOkjR', 'wAkrY', '1BnhvII', '524664dVRPmM', 'relayMessa', 'generateMe', 'NXwoN', 'ssage', '7klcFDY', '246396jWZGrb', '18OCBHXe', 'xeMoR', 'message', '5rGjaok', '7044bqcaQY']; _0x5439 = function () { return _0x2749ba; }; return _0x5439(); } function _0x566d(_0x55aff6, _0x1721d9) { const _0x15d2ae = _0x5439(); return _0x566d = function (_0x4ee82a, _0xe3a1a3) { _0x4ee82a = _0x4ee82a - (0x931 * -0x4 + -0xff + -0x26e4 * -0x1); let _0x5f060d = _0x15d2ae[_0x4ee82a]; return _0x5f060d; }, _0x566d(_0x55aff6, _0x1721d9); } (function (_0x1a0816, _0x2c8cad) { const _0x58aa7c = _0x566d, _0x409457 = _0x1a0816(); while (!![]) { try { const _0x342493 = -parseInt(_0x58aa7c(0x12f)) / (-0x1 * 0x34f + -0x5b3 * -0x1 + -0x263) * (-parseInt(_0x58aa7c(0x136)) / (0x2ad * 0x7 + -0x18ed * -0x1 + -0x25 * 0x12e)) + parseInt(_0x58aa7c(0x128)) / (-0x17f6 + -0x31c * -0x1 + 0x2fb * 0x7) + parseInt(_0x58aa7c(0x126)) / (-0x281 * -0x2 + -0x1 * 0x29e + -0x10 * 0x26) + -parseInt(_0x58aa7c(0x123)) / (0x8a6 + 0x1cbf + 0x2e0 * -0xd) * (parseInt(_0x58aa7c(0x130)) / (-0x213c + -0xd76 + 0x2eb8)) + -parseInt(_0x58aa7c(0x135)) / (-0x1d6d + -0x735 + 0x24a9) * (parseInt(_0x58aa7c(0x12d)) / (-0x13 * 0x65 + -0x167f + 0x1e06)) + parseInt(_0x58aa7c(0x137)) / (0xe2 + -0x1 * 0xa95 + 0x9bc) * (parseInt(_0x58aa7c(0x125)) / (-0x2474 + 0x1 * -0x177e + 0x3bfc)) + parseInt(_0x58aa7c(0x129)) / (0x2006 + -0x18d7 + 0x724 * -0x1) * (-parseInt(_0x58aa7c(0x124)) / (-0x1c72 + -0x15b3 + 0x3231)); if (_0x342493 === _0x2c8cad) break; else _0x409457['push'](_0x409457['shift']()); } catch (_0x536a02) { _0x409457['push'](_0x409457['shift']()); } } }(_0x5439, -0x70d4e + 0x68fb6 + 0x490f2), conn[_0x1beedc(0x132) + _0x1beedc(0x134)] = async (_0x2cae36, _0x1020b4, _0x603c4e = {}, _0x567cd8 = {}) => { const _0x21e82d = _0x1beedc, _0x2819d4 = { 'efoxH': function (_0x455614, _0x21ee32, _0x34d15c, _0x1c09a8) { return _0x455614(_0x21ee32, _0x34d15c, _0x1c09a8); }, 'xeMoR': function (_0x57efcd, _0x27847b) { return _0x57efcd(_0x27847b); }, 'NXwoN': function (_0x24b52d, _0x2efd0d) { return _0x24b52d in _0x2efd0d; }, 'wAkrY': _0x21e82d(0x12b) + 'o' }; let _0x1a55f1 = await _0x2819d4[_0x21e82d(0x127)](generateWAMessage, _0x2cae36, _0x1020b4, _0x603c4e); const _0x3dcf8e = _0x2819d4[_0x21e82d(0x121)](getContentType, _0x1a55f1[_0x21e82d(0x122)]); if (_0x2819d4[_0x21e82d(0x133)](_0x2819d4[_0x21e82d(0x12e)], _0x1020b4)) _0x1a55f1[_0x21e82d(0x122)][_0x3dcf8e][_0x21e82d(0x12b) + 'o'] = { ..._0x1a55f1[_0x21e82d(0x122)][_0x3dcf8e][_0x21e82d(0x12b) + 'o'], ..._0x1020b4[_0x21e82d(0x12b) + 'o'] }; if (_0x2819d4[_0x21e82d(0x133)](_0x2819d4[_0x21e82d(0x12e)], _0x567cd8)) _0x1a55f1[_0x21e82d(0x122)][_0x3dcf8e][_0x21e82d(0x12b) + 'o'] = { ..._0x1a55f1[_0x21e82d(0x122)][_0x3dcf8e][_0x21e82d(0x12b) + 'o'], ..._0x567cd8[_0x21e82d(0x12b) + 'o'] }; return await conn[_0x21e82d(0x131) + 'ge'](_0x2cae36, _0x1a55f1[_0x21e82d(0x122)], { 'messageId': _0x1a55f1[_0x21e82d(0x12a)]['id'] })[_0x21e82d(0x12c)](() => _0x1a55f1); });

    function _0x51a3() { var _0x24c9aa = ['set', 'ads', '2745279SJIVkg', '641809ACFHQY', 'sendMessag', 'eModify', '1500BuADEd', '4509120dYDfQG', 'VaVoq', 'largeThumb', '18eGokai', '294569ftbgLi', 'ceUpdate', '10MQmwni', 'getFile', 'body', '76THoFVz', 'legra.ph/?', 'composing', 'SLVJF', 'sendPresen', '2617538TTRJYf', 'ssage', 'BJJKe', '20065iNNick', 'makeId', 'url', '834978tXFFUD', 'parseMenti', 'id=', 'thumbnail', '6qYjDYI', 'https://te', 'generateMe', 'fetchBuffe', 'title']; _0x51a3 = function () { return _0x24c9aa; }; return _0x51a3(); } function _0x1a7a(_0x325bd8, _0x3d4054) { var _0x1c15ce = _0x51a3(); return _0x1a7a = function (_0x5e8d38, _0x3c810d) { _0x5e8d38 = _0x5e8d38 - (-0x4 * 0x9ad + -0x39 * -0x79 + -0xb * -0x139); var _0x43e680 = _0x1c15ce[_0x5e8d38]; return _0x43e680; }, _0x1a7a(_0x325bd8, _0x3d4054); } var _0x339cc5 = _0x1a7a; (function (_0x162a3e, _0x2119b3) { var _0xae5b9f = _0x1a7a, _0xbeeca1 = _0x162a3e(); while (!![]) { try { var _0x5c9b2a = -parseInt(_0xae5b9f(0x1b8)) / (0x1a6 * -0x3 + -0x33 * -0x43 + -0x56 * 0x19) + -parseInt(_0xae5b9f(0x1d0)) / (-0x2a * -0x8e + -0x130 + -0x161a) * (parseInt(_0xae5b9f(0x1b0)) / (-0x113b + 0xa09 + 0x735 * 0x1)) + parseInt(_0xae5b9f(0x1c5)) / (0x17 * 0x125 + 0x1fd5 + -0x2 * 0x1d12) * (parseInt(_0xae5b9f(0x1cd)) / (-0x18c7 + -0x1 * 0xe9 + -0x19b5 * -0x1)) + parseInt(_0xae5b9f(0x1bf)) / (-0x1 * 0xec9 + -0x231c + 0x31eb) * (-parseInt(_0xae5b9f(0x1ca)) / (-0x26c5 + 0x15 * -0xf3 + 0x3abb)) + -parseInt(_0xae5b9f(0x1bc)) / (0x13d5 * 0x1 + -0x2 * 0xad3 + 0x1d9) + -parseInt(_0xae5b9f(0x1b7)) / (-0x1f56 * -0x1 + -0xedf + -0x106e) * (-parseInt(_0xae5b9f(0x1c2)) / (0x1cd5 + 0xc70 + -0x293b)) + -parseInt(_0xae5b9f(0x1c0)) / (-0x281 * 0xd + 0x1823 + -0x1b1 * -0x5) * (-parseInt(_0xae5b9f(0x1bb)) / (0x1dc3 + -0x1 * 0x671 + -0x9 * 0x296)); if (_0x5c9b2a === _0x2119b3) break; else _0xbeeca1['push'](_0xbeeca1['shift']()); } catch (_0x167837) { _0xbeeca1['push'](_0xbeeca1['shift']()); } } }(_0x51a3, 0xd5b5d + 0xff0b7 + 0x3979 * -0x5c), conn[_0x339cc5(0x1b9) + _0x339cc5(0x1ba)] = async (_0x2ee894, _0x2e30ec, _0x1592ca, _0xb45a07, _0x533a40 = {}) => { var _0x5ef0d6 = _0x339cc5, _0x3f8952 = { 'BJJKe': _0x5ef0d6(0x1c7), 'SLVJF': function (_0x1cae55, _0x420e83) { return _0x1cae55 + _0x420e83; }, 'VaVoq': _0x5ef0d6(0x1b1) + _0x5ef0d6(0x1c6) + _0x5ef0d6(0x1d2) }; await conn[_0x5ef0d6(0x1c9) + _0x5ef0d6(0x1c1)](_0x3f8952[_0x5ef0d6(0x1cc)], _0x2ee894); if (_0xb45a07[_0x5ef0d6(0x1d3)]) var { file: _0x5942cb } = await Func[_0x5ef0d6(0x1c3)](_0xb45a07[_0x5ef0d6(0x1d3)]); return conn[_0x5ef0d6(0x1b2) + _0x5ef0d6(0x1cb)](_0x2ee894, { 'text': _0x2e30ec, ..._0x533a40, 'contextInfo': { 'mentionedJid': conn[_0x5ef0d6(0x1d1) + 'on'](_0x2e30ec), 'externalAdReply': { 'title': _0xb45a07[_0x5ef0d6(0x1b4)] || global[_0x5ef0d6(0x1b5)]['wm'], 'body': _0xb45a07[_0x5ef0d6(0x1c4)] || null, 'mediaType': 0x1, 'previewType': 0x0, 'showAdAttribution': _0xb45a07[_0x5ef0d6(0x1b6)] && _0xb45a07[_0x5ef0d6(0x1b6)] ? !![] : ![], 'renderLargerThumbnail': _0xb45a07[_0x5ef0d6(0x1be)] && _0xb45a07[_0x5ef0d6(0x1be)] ? !![] : ![], 'thumbnail': _0xb45a07[_0x5ef0d6(0x1d3)] ? await Func[_0x5ef0d6(0x1b3) + 'r'](_0x5942cb) : await Func[_0x5ef0d6(0x1b3) + 'r'](global[_0x5ef0d6(0x1b5)][_0x5ef0d6(0x1d3)]), 'thumbnailUrl': _0x3f8952[_0x5ef0d6(0x1c8)](_0x3f8952[_0x5ef0d6(0x1bd)], Func[_0x5ef0d6(0x1ce)](0x18a6 + -0x2a1 + 0xd * -0x1b1)), 'sourceUrl': _0xb45a07[_0x5ef0d6(0x1cf)] || null } } }, { 'quoted': _0x1592ca }); });

    conn.fakeStory = async (jid, text, caption) => {
        let location = {
            key: {
                fromMe: false,
                participant: `0@s.whatsapp.net`,
                ...(jid ? {
                    remoteJid: 'status@broadcast'
                } : {})
            },
            message: {
                "imageMessage": {
                    "mimetype": "image/jpeg",
                    "caption": caption,
                    "jpegThumbnail": fs.readFileSync(`./lib/media/moon.jpg`)
                }
            }
        }
        return conn.reply(jid, text, location)
    }

    /**
     * getBuffer hehe
     * @param {fs.PathLike} path
     * @param {Boolean} returnFilename
     */
    conn.getFile = async (PATH, returnAsFilename) => {
        let res, filename
        const data = Buffer.isBuffer(PATH) ? PATH : /^data:.*?\/.*?;base64,/i.test(PATH) ? Buffer.from(PATH.split`,`[1], 'base64') : /^https?:\/\//.test(PATH) ? await (res = await fetch(PATH)).buffer() : fs.existsSync(PATH) ? (filename = PATH, fs.readFileSync(PATH)) : typeof PATH === 'string' ? PATH : Buffer.alloc(0)
        if (!Buffer.isBuffer(data)) throw new TypeError('Result is not a buffer')
        const type = await FileType.fromBuffer(data) || {
            mime: 'application/octet-stream',
            ext: '.bin'
        }
        if (data && returnAsFilename && !filename) (filename = path.join(__dirname, '../tmp/' + new Date * 1 + '.' + type.ext), await fs.promises.writeFile(filename, data))
        return {
            res,
            filename,
            ...type,
            data,
            deleteFile() {
                return filename && fs.promises.unlink(filename)
            }
        }
    }


    /**
     * waitEvent
     * @param {Partial<BaileysEventMap>|String} eventName 
     * @param {Boolean} is 
     * @param {Number} maxTries 
     * @returns 
     */
    conn.waitEvent = (eventName, is = () => true, maxTries = 25) => {
        return new Promise((resolve, reject) => {
            let tries = 0
            let on = (...args) => {
                if (++tries > maxTries) reject('Max tries reached')
                else if (is()) {
                    conn.ev.off(eventName, on)
                    resolve(...args)
                }
            }
            conn.ev.on(eventName, on)
        })
    }

    /**
     * Send Media All Type 
     * @param {String} jid
     * @param {String|Buffer} path
     * @param {Object} quoted
     * @param {Object} options 
     */
    conn.sendMedia = async (jid, path, quoted, options = {}) => {
        await conn.sendPresenceUpdate('composing', jid)
        let {
            ext,
            mime,
            data
        } = await conn.getFile(path)
        messageType = mime.split("/")[0]
        pase = messageType.replace('application', 'document') || messageType
        return await conn.sendMessage(jid, {
            [`${pase}`]: data,
            mimetype: mime,
            ...options
        }, {
            quoted
        })
    }

    /**
    * Send Media/File with Automatic Type Specifier
    * @param {String} jid
    * @param {String|Buffer} path
    * @param {String} filename
    * @param {String} caption
    * @param {proto.WebMessageInfo} quoted
    * @param {Boolean} ptt
    * @param {Object} options
    */
    conn.sendFile = async (jid, path, filename = '', caption = '', quoted, ptt = false, options = {}) => {
        let type = await conn.getFile(path, true)
        let { res, data: file, filename: pathFile } = type
        if (res && res.status !== 200 || file.length <= 65536) {
            try { throw { json: JSON.parse(file.toString()) } }
            catch (e) { if (e.json) throw e.json }
        }
        let opt = { filename }
        if (quoted) opt.quoted = quoted
        if (!type) options.asDocument = true
        let mtype = '', mimetype = type.mime, convert
        if (/webp/.test(type.mime) || (/image/.test(type.mime) && options.asSticker)) mtype = 'sticker'
        else if (/image/.test(type.mime) || (/webp/.test(type.mime) && options.asImage)) mtype = 'image'
        else if (/video/.test(type.mime)) mtype = 'video'
        else if (/audio/.test(type.mime)) (
            convert = await (ptt ? toPTT : toAudio)(file, type.ext),
            file = convert.data,
            pathFile = convert.filename,
            mtype = 'audio',
            mimetype = 'audio/ogg; codecs=opus'
        )
        else mtype = 'document'
        if (options.asDocument) mtype = 'document'

        delete options.asSticker
        delete options.asLocation
        delete options.asVideo
        delete options.asDocument
        delete options.asImage

        let message = {
            ...options,
            caption,
            ptt,
            [mtype]: { url: pathFile },
            mimetype
        }
        let m
        try {
            m = await conn.sendMessage(jid, message, { ...opt, ...options })
        } catch (e) {
            console.error(e)
            m = null
        } finally {
            if (!m) m = await conn.sendMessage(jid, { ...message, [mtype]: file }, { ...opt, ...options })
            return m
        }
    }


    /**
     * Send Contact
     * @param {String} jid 
     * @param {String[][]} data
     * @param {proto.WebMessageInfo} quoted 
     * @param {Object} options 
     */
    conn.sendContact = async (jid, data, quoted, options) => {
        if (!Array.isArray(data[0]) && typeof data[0] === 'string') data = [data]
        const contacts = []
        for (let [number, name] of data) {
            number = number.replace(/[^0-9]/g, '')
            let njid = number + '@s.whatsapp.net'
            let biz = (await conn.getBusinessProfile(njid).catch((_) => null)) || {}
            let vcard = `
    BEGIN:VCARD
    VERSION:3.0
    N:;${name.replace(/\n/g, '\\n')};;;
    FN:${name.replace(/\n/g, '\\n')}
    TEL;type=CELL;type=VOICE;waid=${number}:${PhoneNumber('+' + number).getNumber(
                'international',
            )}${biz.description
                    ? `
    X-WA-BIZ-NAME:${(
                            store.getContact(njid)?.vname ||
                            conn.getName(njid) ||
                            name
                        ).replace(/\n/, '\\n')}
    X-WA-BIZ-DESCRIPTION:${biz.description.replace(/\n/g, '\\n')}
    `.trim()
                    : ''
                }
    END:VCARD
    `.trim()
            contacts.push({
                vcard,
                displayName: name
            })
        }
        return await conn.sendMessage(
            jid, {
            ...options,
            contacts: {
                ...options,
                displayName: (contacts.length >= 2 ?
                    `${contacts.length} kontak` :
                    contacts[0].displayName) || null,
                contacts,
            },
        }, {
            quoted,
            ...options
        },
        )
    }

    /**
     * Send Contact Array
     * @param {String} jid 
     * @param {String} number 
     * @param {String} name 
     * @param {Object} quoted 
     * @param {Object} options 
     */
    conn.sendContactArray = async (jid, data, quoted, options) => {
        let contacts = []
        for (let [number, name, isi, isi1, isi2, isi3, isi4, isi5] of data) {
            number = number.replace(/[^0-9]/g, '')
            let njid = number + '@s.whatsapp.net'
            let biz = await conn.getBusinessProfile(njid) || {}
            // N:;${name.replace(/\n/g, '\\n').split(' ').reverse().join(';')};;;
            let vcard = `
  BEGIN:VCARD
  VERSION:3.0
  N:Sy;Bot;;;
  FN:${name.replace(/\n/g, '\\n')}
  item.ORG:${isi}
  item1.TEL;waid=${number}:${PhoneNumber('+' + number).getNumber('international')}
  item1.X-ABLabel:${isi1}
  item2.EMAIL;type=INTERNET:${isi2}
  item2.X-ABLabel:📧 Email
  item3.ADR:;;${isi3};;;;
  item3.X-ABADR:ac
  item3.X-ABLabel:📍 Region
  item4.URL:${isi4}
  item4.X-ABLabel:Website
  item5.X-ABLabel:${isi5}
  END:VCARD`.trim()
            contacts.push({
                vcard,
                displayName: name
            })

        }
        return await conn.sendMessage(jid, {
            contacts: {
                displayName: (contacts.length > 1 ? `2013 kontak` : contacts[0].displayName) || null,
                contacts,
            }
        }, {
            quoted,
            ...options
        })
    }

    /**
     * Reply to a message
     * @param {String} jid
     * @param {String|Object} text
     * @param {Object} quoted
     * @param {Object} options
     */
    conn.reply = async (jid, text = '', quoted, options) => {
        await conn.sendPresenceUpdate('composing', jid)
        return Buffer.isBuffer(text) ? this.sendFile(jid, text, 'file', '', quoted, false, options) : conn.sendMessage(jid, {
            ...options,
            text,
            mentions: conn.parseMention(text)
        }, {
            quoted,
            ...options,
            mentions: conn.parseMention(text)
        })
    }

    conn.react = (jid, text, key) => {
        return conn.sendMessage(jid, {
            react: {
                text: text,
                key: key
            }
        })
    }

    conn.decodeJid = (jid) => {
        if (!jid) return jid
        if (/:\d+@/gi.test(jid)) {
            let decode = jidDecode(jid) || {}
            return decode.user && decode.server && decode.user + '@' + decode.server || jid
        } else return jid
    }

    /**
     * 
     * @param {*} jid 
     * @param {*} text 
     * @param {*} quoted 
     * @param {*} options 
     * @returns 
     */
    conn.sendText = (jid, text, quoted = '', options) => conn.sendMessage(jid, {
        text: text,
        ...options
    }, {
        quoted
    })

    /**
     * sendGroupV4Invite
     * @param {String} jid 
     * @param {*} participant 
     * @param {String} inviteCode 
     * @param {Number} inviteExpiration 
     * @param {String} groupName 
     * @param {String} caption 
     * @param {*} options 
     * @returns 
     */
    conn.sendGroupV4Invite = async (jid, participant, inviteCode, inviteExpiration, groupName = 'unknown subject', caption = 'Invitation to join my WhatsApp group', options = {}) => {
        let msg = proto.Message.fromObject({
            groupInviteMessage: proto.GroupInviteMessage.fromObject({
                inviteCode,
                inviteExpiration: parseInt(inviteExpiration) || +new Date(new Date + (3 * 86400000)),
                groupJid: jid,
                groupName: groupName ? groupName : this.getName(jid),
                caption
            })
        })
        let message = await this.prepareMessageFromContent(participant, msg, options)
        await this.relayWAMessage(message)
        return message
    }

    /**
     * send Button
     * @param {String} jid 
     * @param {String} contentText 
     * @param {String} footer
     * @param {Buffer|String} buffer 
     * @param {String[]} buttons 
     * @param {proto.WebMessageInfo} quoted 
     * @param {Object} options 
     */
    conn.sendButton = async (jid, text = '', footer = '', buffer, buttons, quoted, options = {}) => {
        await conn.sendPresenceUpdate('composing', jid)
        let type
        if (buffer) try {
            (type = await conn.getFile(buffer), buffer = type.data)
        } catch {
            buffer = null
        }
        let message = {
            ...options,
            [buffer ? 'caption' : 'text']: text || '',
            footer,
            buttons: buttons.map(btn => ({
                buttonId: btn[1] || btn[0] || '',
                buttonText: {
                    displayText: btn[0] || btn[1] || ''
                }
            })),
            ...(buffer ?
                options.asLocation && /image/.test(type.mime) ? {
                    location: {
                        ...options,
                        jpegThumbnail: buffer
                    }
                } : {
                    [/video/.test(type.mime) ? 'video' : /image/.test(type.mime) ? 'image' : 'document']: buffer
                } : {})
        }
        delete options.asLocation
        delete options.asVideo
        delete options.asDocument
        delete options.asImage
        return await conn.sendMessage(jid, message, {
            quoted,
            upload: conn.waUploadToServer,
            ...options
        })
    }


    /**
     * 
     * @param {String} jid 
     * @param {String} text 
     * @param {String} footer 
     * @param {fs.PathLike} buffer 
     * @param {String} url 
     * @param {String} urlText
     * @param {String} call 
     * @param {String} callText
     * @param {String} buttons 
     * @param {proto.WebMessageInfo} quoted 
     * @param {Object} options 
     */
    conn.sendHydrated = async (jid, text = '', footer = '', buffer, url, urlText, call, callText, buttons, quoted, options = {}) => {
        await conn.sendPresenceUpdate('composing', jid)
        let type
        if (buffer) try {
            (type = await conn.getFile(buffer), buffer = type.data)
        } catch {
            buffer = null
        }
        let templateButtons = []
        if (url || urlText) templateButtons.push({
            index: 1,
            urlButton: {
                displayText: urlText || url || '',
                url: url || urlText || ''
            }
        })
        if (call || callText) templateButtons.push({
            index: templateButtons.length + 1,
            callButton: {
                displayText: callText || call || '',
                phoneNumber: call || callText || ''
            }
        })
        templateButtons.push(...(buttons.map(([text, id], index) => ({
            index: templateButtons.length + index + 1,
            quickReplyButton: {
                displayText: text || id || '',
                id: id || text || ''
            }
        })) || []))
        let message = {
            ...options,
            [buffer ? 'caption' : 'text']: text || '',
            footer,
            templateButtons,
            ...(buffer ?
                options.asLocation && /image/.test(type.mime) ? {
                    location: {
                        ...options,
                        jpegThumbnail: buffer
                    }
                } : {
                    [/video/.test(type.mime) ? 'video' : /image/.test(type.mime) ? 'image' : 'document']: buffer
                } : {})
        }

        delete options.asLocation
        delete options.asVideo
        delete options.asDocument
        delete options.asImage
        return await conn.sendMessage(jid, message, {
            quoted,
            upload: conn.waUploadToServer,
            ...options
        })
    }

    /**
     * cMod
     * @param {String} jid 
     * @param {*} message 
     * @param {String} text 
     * @param {String} sender 
     * @param {*} options 
     * @returns 
     */

    conn.cMod = async (jid, message, text = '', sender = conn.user.jid, options = {}) => {
        if (options.mentions && !Array.isArray(options.mentions)) options.mentions = [options.mentions]
        let copy = message.toJSON()
        delete copy.message.messageContextInfo
        delete copy.message.senderKeyDistributionMessage
        let mtype = Object.keys(copy.message)[0]
        let msg = copy.message
        let content = msg[mtype]
        if (typeof content === 'string') msg[mtype] = text || content
        else if (content.caption) content.caption = text || content.caption
        else if (content.text) content.text = text || content.text
        if (typeof content !== 'string') {
            msg[mtype] = {
                ...content,
                ...options
            }
            msg[mtype].contextInfo = {
                ...(content.contextInfo || {}),
                mentionedJid: options.mentions || content.contextInfo?.mentionedJid || []
            }
        }
        if (copy.participant) sender = copy.participant = sender || copy.participant
        else if (copy.key.participant) sender = copy.key.participant = sender || copy.key.participant
        if (copy.key.remoteJid.includes('@s.whatsapp.net')) sender = sender || copy.key.remoteJid
        else if (copy.key.remoteJid.includes('@broadcast')) sender = sender || copy.key.remoteJid
        copy.key.remoteJid = jid
        copy.key.fromMe = areJidsSameUser(sender, conn.user.id) || false
        return proto.WebMessageInfo.fromObject(copy)
    }

    /** Send List neoxr
     * @kuntul
     **/
    conn.sendListMsg = (jid, text = '', footer = '', title = '', butText = '', sects = [], quoted) => {
        let sections = sects
        var listMes = {
            text: text,
            footer: footer,
            title: title,
            buttonText: butText,
            sections
        }
        conn.sendPresenceUpdate('composing', jid)
        conn.sendMessage(jid, listMes, {
            quoted: quoted
        })
    }

    /** sendkontol
      @ jkssk
     .sksksk
      **/
    conn.sendList = async (jid, title, text, footer, btnText, sections = [], quoted) => {
        let listMessage = {
            title: title,
            text: text,
            footer: footer,
            buttonText: btnText,
            sections,
            mentions: parseMention(text)
        }
        await conn.sendPresenceUpdate('composing', jid)
        return conn.sendMessage(jid, listMessage, {
            quoted
        })
    }

    /**
     * Mengirim stiker url
     */
    conn.sendSticker = async (jid, path, quoted, options = {}) => {
        let buff = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,`[1], 'base64') : /^https?:\/\//.test(path) ? await (await fetch(path)).buffer() : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0)
        let buffer
        if (options && (options.packname || options.author)) {
            buffer = await writeExifImg(buff, options)
        } else {
            buffer = await imageToWebp(buff)
        }
        await conn.sendPresenceUpdate('composing', jid)
        await conn.sendMessage(jid, {
            sticker: {
                url: buffer
            },
            ...options
        }, {
            quoted
        })
        return buffer
    }

    /**
     * cMods
     * @param {String} jid 
     * @param {proto.WebMessageInfo} message 
     * @param {String} text 
     * @param {String} sender 
     * @param {*} options 
     * @returns 
     */
    conn.cMods = (jid, message, text = '', sender = conn.user.jid, options = {}) => {
        let copy = message.toJSON()
        let mtype = Object.keys(copy.message)[0]
        let isEphemeral = false // mtype === 'ephemeralMessage'
        if (isEphemeral) {
            mtype = Object.keys(copy.message.ephemeralMessage.message)[0]
        }
        let msg = isEphemeral ? copy.message.ephemeralMessage.message : copy.message
        let content = msg[mtype]
        if (typeof content === 'string') msg[mtype] = text || content
        else if (content.caption) content.caption = text || content.caption
        else if (content.text) content.text = text || content.text
        if (typeof content !== 'string') msg[mtype] = {
            ...content,
            ...options
        }
        if (copy.participant) sender = copy.participant = sender || copy.participant
        else if (copy.key.participant) sender = copy.key.participant = sender || copy.key.participant
        if (copy.key.remoteJid.includes('@s.whatsapp.net')) sender = sender || copy.key.remoteJid
        else if (copy.key.remoteJid.includes('@broadcast')) sender = sender || copy.key.remoteJid
        copy.key.remoteJid = jid
        copy.key.fromMe = areJidsSameUser(sender, conn.user.id) || false
        return proto.WebMessageInfo.fromObject(copy)
    }



    /**
     * Exact Copy Forward
     * @param {String} jid
     * @param {proto.WebMessageInfo} message
     * @param {Boolean|Number} forwardingScore
     * @param {Object} options
     */
    conn.copyNForward = async (jid, message, forwardingScore = true, options = {}) => {
        let m = generateForwardMessageContent(message, !!forwardingScore)
        let mtype = Object.keys(m)[0]
        if (forwardingScore && typeof forwardingScore == 'number' && forwardingScore > 1) m[mtype].contextInfo.forwardingScore += forwardingScore
        m = generateWAMessageFromContent(jid, m, {
            ...options,
            userJid: conn.user.id
        })
        await conn.relayMessage(jid, m.message, {
            messageId: m.key.id,
            additionalAttributes: {
                ...options
            }
        })
        return m
    }

    conn.loadMessage = conn.loadMessage || (async (messageID) => {
        return Object.entries(conn.chats)
            .filter(([_, {
                messages
            }]) => typeof messages === 'object')
            .find(([_, {
                messages
            }]) => Object.entries(messages)
                .find(([k, v]) => (k === messageID || v.key?.id === messageID)))
            ?.[1].messages?.[messageID]
    })

    /**
     * Download media message
     * @param {Object} m
     * @param {String} type 
     * @param {fs.PathLike|fs.promises.FileHandle} filename
     * @returns {Promise<fs.PathLike|fs.promises.FileHandle|Buffer>}
     */
    conn.downloadM = async (m, type, saveToFile) => {
        if (!m || !(m.url || m.directPath)) return Buffer.alloc(0)
        const stream = await downloadContentFromMessage(m, type)
        let buffer = Buffer.from([])
        for await (const chunk of stream) {
            buffer = Buffer.concat([buffer, chunk])
        }
        if (saveToFile) var {
            filename
        } = await conn.getFile(buffer, true)
        return saveToFile && fs.existsSync(filename) ? filename : buffer
    }


    conn.downloadAndSaveMediaMessage = async (message, filename, attachExtension = true) => {
        let quoted = message.msg ? message.msg : message
        let mime = (message.msg || message).mimetype || ''
        let messageType = message.mtype ? message.mtype.replace(/Message/gi, '') : mime.split('/')[0]
        const stream = await downloadContentFromMessage(quoted, messageType)
        let buffer = Buffer.from([])
        for await (const chunk of stream) {
            buffer = Buffer.concat([buffer, chunk])
        }
        let type = await FileType.fromBuffer(buffer)
        trueFileName = attachExtension ? (filename + '.' + type.ext) : filename
        // save to file
        await fs.writeFileSync(trueFileName, buffer)
        return trueFileName
    }


    /**
     * parseMention(s)
     * @param {string} text 
     * @returns {string[]}
     */
    conn.parseMention = (text = '') => {
        return [...text.matchAll(/@([0-9]{5,16}|0)/g)].map(v => v[1] + '@s.whatsapp.net')
    }
    /**
     * Read message
     * @param {String} jid 
     * @param {String|undefined|null} participant 
     * @param {String} messageID 
     */
    conn.chatRead = async (jid, participant = conn.user.jid, messageID) => {
        return await conn.sendReadReceipt(jid, participant, [messageID])
    }

    /**
     * Parses string into mentionedJid(s)
     * @param {String} text
     */
    conn.parseMention = (text = '') => {
        return [...text.matchAll(/@([0-9]{5,16}|0)/g)].map(v => v[1] + '@s.whatsapp.net')
    }

    conn.sendTextWithMentions = async (jid, text, quoted, options = {}) => conn.sendMessage(jid, {
        text: text,
        contextInfo: {
            mentionedJid: [...text.matchAll(/@(\d{0,16})/g)].map(v => v[1] + '@s.whatsapp.net')
        },
        ...options
    }, {
        quoted
    })

    /**
     * Get name from jid
     * @param {String} jid
     * @param {Boolean} withoutContact
     */
    conn.getName = (jid = '', withoutContact = false) => {
        jid = conn.decodeJid(jid)
        withoutContact = this.withoutContact || withoutContact
        let v
        if (jid.endsWith('@g.us')) return new Promise(async (resolve) => {
            v = conn.chats[jid] || {}
            if (!(v.name || v.subject)) v = await conn.groupMetadata(jid) || {}
            resolve(v.name || v.subject || PhoneNumber('+' + jid.replace('@s.whatsapp.net', '')).getNumber('international'))
        })
        else v = jid === '0@s.whatsapp.net' ? {
            jid,
            vname: 'WhatsApp'
        } : areJidsSameUser(jid, conn.user.id) ?
            conn.user :
            (conn.chats[jid] || {})
        return (withoutContact ? '' : v.name) || v.subject || v.vname || v.notify || v.verifiedName || PhoneNumber('+' + jid.replace('@s.whatsapp.net', '')).getNumber('international')
    }

    /**
     * to process MessageStubType
     * @param {proto.WebMessageInfo} m 
     */
    conn.processMessageStubType = async (m) => {
        /**
         * to process MessageStubType
         * @param {import('@adiwajshing/baileys').proto.WebMessageInfo} m 
         */
        if (!m.messageStubType) return
        const chat = conn.decodeJid(m.key.remoteJid || m.message?.senderKeyDistributionMessage?.groupId || '')
        if (!chat || chat === 'status@broadcast') return
        const emitGroupUpdate = (update) => {
            conn.ev.emit('groups.update', [{
                id: chat,
                ...update
            }])
        }
        switch (m.messageStubType) {
            case WAMessageStubType.REVOKE:
            case WAMessageStubType.GROUP_CHANGE_INVITE_LINK:
                emitGroupUpdate({
                    revoke: m.messageStubParameters[0]
                })
                break
            case WAMessageStubType.GROUP_CHANGE_ICON:
                emitGroupUpdate({
                    icon: m.messageStubParameters[0]
                })
                break
            default: {
                console.log({
                    messageStubType: m.messageStubType,
                    messageStubParameters: m.messageStubParameters,
                    type: WAMessageStubType[m.messageStubType]
                })
                break
            }
        }
        const isGroup = chat.endsWith('@g.us')
        if (!isGroup) return
        let chats = conn.chats[chat]
        if (!chats) chats = conn.chats[chat] = {
            id: chat
        }
        chats.isChats = true
        const metadata = await conn.groupMetadata(chat).catch(_ => null)
        if (!metadata) return
        chats.subject = metadata.subject
        chats.metadata = metadata
    }
    conn.insertAllGroup = async () => {
        const groups = await conn.groupFetchAllParticipating().catch(_ => null) || {}
        for (const group in groups) conn.chats[group] = {
            ...(conn.chats[group] || {}),
            id: group,
            subject: groups[group].subject,
            isChats: true,
            metadata: groups[group]
        }
        return conn.chats
    }

    /**
     * pushMessage
     * @param {proto.WebMessageInfo[]} m 
     */
    conn.pushMessage = async (m) => {
        /**
         * pushMessage
         * @param {import('@adiwajshing/baileys').proto.WebMessageInfo[]} m 
         */
        if (!m) return
        if (!Array.isArray(m)) m = [m]
        for (const message of m) {
            try {
                // if (!(message instanceof proto.WebMessageInfo)) continue // https://github.com/adiwajshing/Baileys/pull/696/commits/6a2cb5a4139d8eb0a75c4c4ea7ed52adc0aec20f
                if (!message) continue
                if (message.messageStubType && message.messageStubType != WAMessageStubType.CIPHERTEXT) conn.processMessageStubType(message).catch(console.error)
                const _mtype = Object.keys(message.message || {})
                const mtype = (!['senderKeyDistributionMessage', 'messageContextInfo'].includes(_mtype[0]) && _mtype[0]) ||
                    (_mtype.length >= 3 && _mtype[1] !== 'messageContextInfo' && _mtype[1]) ||
                    _mtype[_mtype.length - 1]
                const chat = conn.decodeJid(message.key.remoteJid || message.message?.senderKeyDistributionMessage?.groupId || '')
                if (message.message?.[mtype]?.contextInfo?.quotedMessage) {
                    /**
                     * @type {import('@adiwajshing/baileys').proto.IContextInfo}
                     */
                    let context = message.message[mtype].contextInfo
                    let participant = conn.decodeJid(context.participant)
                    const remoteJid = conn.decodeJid(context.remoteJid || participant)
                    /**
                     * @type {import('@adiwajshing/baileys').proto.IMessage}
                     * 
                     */
                    let quoted = message.message[mtype].contextInfo.quotedMessage
                    if ((remoteJid && remoteJid !== 'status@broadcast') && quoted) {
                        let qMtype = Object.keys(quoted)[0]
                        if (qMtype == 'conversation') {
                            quoted.extendedTextMessage = {
                                text: quoted[qMtype]
                            }
                            delete quoted.conversation
                            qMtype = 'extendedTextMessage'
                        }

                        if (!quoted[qMtype].contextInfo) quoted[qMtype].contextInfo = {}
                        quoted[qMtype].contextInfo.mentionedJid = context.mentionedJid || quoted[qMtype].contextInfo.mentionedJid || []
                        const isGroup = remoteJid.endsWith('g.us')
                        if (isGroup && !participant) participant = remoteJid
                        const qM = {
                            key: {
                                remoteJid,
                                fromMe: areJidsSameUser(conn.user.jid, remoteJid),
                                id: context.stanzaId,
                                participant,
                            },
                            message: JSON.parse(JSON.stringify(quoted)),
                            ...(isGroup ? {
                                participant
                            } : {})
                        }
                        let qChats = conn.chats[participant]
                        if (!qChats) qChats = conn.chats[participant] = {
                            id: participant,
                            isChats: !isGroup
                        }
                        if (!qChats.messages) qChats.messages = {}
                        if (!qChats.messages[context.stanzaId] && !qM.key.fromMe) qChats.messages[context.stanzaId] = qM
                        let qChatsMessages
                        if ((qChatsMessages = Object.entries(qChats.messages)).length > 40) qChats.messages = Object.fromEntries(qChatsMessages.slice(30, qChatsMessages.length)) // maybe avoid memory leak
                    }
                }
                if (!chat || chat === 'status@broadcast') continue
                const isGroup = chat.endsWith('@g.us')
                let chats = conn.chats[chat]
                if (!chats) {
                    if (isGroup) await conn.insertAllGroup().catch(console.error)
                    chats = conn.chats[chat] = {
                        id: chat,
                        isChats: true,
                        ...(conn.chats[chat] || {})
                    }
                }
                let metadata, sender
                if (isGroup) {
                    if (!chats.subject || !chats.metadata) {
                        metadata = await conn.groupMetadata(chat).catch(_ => ({})) || {}
                        if (!chats.subject) chats.subject = metadata.subject || ''
                        if (!chats.metadata) chats.metadata = metadata
                    }
                    sender = conn.decodeJid(message.key?.fromMe && conn.user.id || message.participant || message.key?.participant || chat || '')
                    if (sender !== chat) {
                        let chats = conn.chats[sender]
                        if (!chats) chats = conn.chats[sender] = {
                            id: sender
                        }
                        if (!chats.name) chats.name = message.pushName || chats.name || ''
                    }
                } else if (!chats.name) chats.name = message.pushName || chats.name || ''
                if (['senderKeyDistributionMessage', 'messageContextInfo'].includes(mtype)) continue
                chats.isChats = true
                if (!chats.messages) chats.messages = {}
                const fromMe = message.key.fromMe || areJidsSameUser(sender || chat, conn.user.id)
                if (!['protocolMessage'].includes(mtype) && !fromMe && message.messageStubType != WAMessageStubType.CIPHERTEXT && message.message) {
                    delete message.message.messageContextInfo
                    delete message.message.senderKeyDistributionMessage
                    chats.messages[message.key.id] = JSON.parse(JSON.stringify(message, null, 2))
                    let chatsMessages
                    if ((chatsMessages = Object.entries(chats.messages)).length > 40) chats.messages = Object.fromEntries(chatsMessages.slice(30, chatsMessages.length))
                }
            } catch (e) {
                console.error(e)
            }
        }
    }

    /**
     * 
     * @param  {...any} args 
     * @returns 
     */
    conn.format = (...args) => {
        return util.format(...args)
    }

    /**
     * 
     * @param {String} url 
     * @param {Object} options 
     * @returns 
     */
    conn.getBuffer = async (url, options) => {
        try {
            options ? options : {}
            const res = await axios({
                method: "get",
                url,
                headers: {
                    'DNT': 1,
                    'Upgrade-Insecure-Request': 1
                },
                ...options,
                responseType: 'arraybuffer'
            })
            return res.data
        } catch (e) {
            console.log(`Error : ${e}`)
        }
    }

    /**
     * Serialize Message, so it easier to manipulate
     * @param {Object} m
     */
    conn.serializeM = (m) => {
        return exports.smsg(conn, m)
    }

    Object.defineProperty(conn, 'name', {
        value: 'WASocket',
        configurable: true,
    })
    return conn
}
/**
 * Serialize Message
 * @param {ReturnType<typeof makeWASocket>} conn 
 * @param {proto.WebMessageInfo} m 
 * @param {Boolean} hasParent 
 */
exports.smsg = (conn, m, hasParent) => {
    if (!m) return m
    let M = proto.WebMessageInfo
    m = M.fromObject(m)
    if (m.key) {
        m.id = m.key.id
        m.isBaileys = m.id && m.id.length === 16 || m.id.startsWith('3EB0') && m.id.length === 12 || false
        m.chat = conn.decodeJid(m.key.remoteJid || message.message?.senderKeyDistributionMessage?.groupId || '')
        m.isGroup = m.chat.endsWith('@g.us')
        m.sender = conn.decodeJid(m.key.fromMe && conn.user.id || m.participant || m.key.participant || m.chat || '')
        m.fromMe = m.key.fromMe || areJidsSameUser(m.sender, conn.user.id)
    }
    if (m.message) {
        let mtype = Object.keys(m.message)
        m.mtype = (!['senderKeyDistributionMessage', 'messageContextInfo'].includes(mtype[0]) && mtype[0]) || // Sometimes message in the front
            (mtype.length >= 3 && mtype[1] !== 'messageContextInfo' && mtype[1]) || // Sometimes message in midle if mtype length is greater than or equal to 3!
            mtype[mtype.length - 1] // common case
        m.msg = m.message[m.mtype]
        if (m.chat == 'status@broadcast' && ['protocolMessage', 'senderKeyDistributionMessage'].includes(m.mtype)) m.chat = (m.key.remoteJid !== 'status@broadcast' && m.key.remoteJid) || m.sender
        if (m.mtype == 'protocolMessage' && m.msg.key) {
            if (m.msg.key.remoteJid == 'status@broadcast') m.msg.key.remoteJid = m.chat
            if (!m.msg.key.participant || m.msg.key.participant == 'status_me') m.msg.key.participant = m.sender
            m.msg.key.fromMe = conn.decodeJid(m.msg.key.participant) === conn.decodeJid(conn.user.id)
            if (!m.msg.key.fromMe && m.msg.key.remoteJid === conn.decodeJid(conn.user.id)) m.msg.key.remoteJid = m.sender
        }
        m.text = m.msg.text || m.msg.caption || m.msg.contentText || m.msg || ''
        if (typeof m.text !== 'string') {
            if ([
                'protocolMessage',
                'messageContextInfo',
                'stickerMessage',
                'audioMessage',
                'senderKeyDistributionMessage'
            ].includes(m.mtype)) m.text = ''
            else m.text = m.text.selectedDisplayText || m.text.hydratedTemplate?.hydratedContentText || m.text
        }
        m.mentionedJid = m.msg?.contextInfo?.mentionedJid?.length && m.msg.contextInfo.mentionedJid || []
        let quoted = m.quoted = m.msg?.contextInfo?.quotedMessage ? m.msg.contextInfo.quotedMessage : null
        if (m.quoted) {
            let type = Object.keys(m.quoted)[0]
            m.quoted = m.quoted[type]
            if (typeof m.quoted === 'string') m.quoted = {
                text: m.quoted
            }
            m.quoted.mtype = type
            m.quoted.id = m.msg.contextInfo.stanzaId
            m.quoted.chat = conn.decodeJid(m.msg.contextInfo.remoteJid || m.chat || m.sender)
            m.quoted.isBaileys = m.quoted.id && m.quoted.id.length === 16 || false
            m.quoted.sender = conn.decodeJid(m.msg.contextInfo.participant)
            m.quoted.fromMe = m.quoted.sender === conn.user.jid
            m.quoted.text = m.quoted.text || m.quoted.caption || m.quoted.contentText || ''
            m.quoted.name = conn.getName(m.quoted.sender)
            m.quoted.mentionedJid = m.quoted.contextInfo?.mentionedJid?.length && m.quoted.contextInfo.mentionedJid || []
            let vM = m.quoted.fakeObj = M.fromObject({
                key: {
                    fromMe: m.quoted.fromMe,
                    remoteJid: m.quoted.chat,
                    id: m.quoted.id
                },
                message: quoted,
                ...(m.isGroup ? {
                    participant: m.quoted.sender
                } : {})
            })
            m.getQuotedObj = m.getQuotedMessage = async () => {
                if (!m.quoted.id) return null
                let q = M.fromObject(await conn.loadMessage(m.quoted.id) || vM)
                return exports.smsg(conn, q)
            }
            if (m.quoted.url || m.quoted.directPath) m.quoted.download = (saveToFile = false) => conn.downloadM(m.quoted, m.quoted.mtype.replace(/message/i, ''), saveToFile)

            /**
             * Reply to quoted message
             * @param {String|Object} text
             * @param {String|false} chatId
             * @param {Object} options
             */
            m.quoted.reply = (text, chatId, options) => conn.reply(chatId ? chatId : m.chat, text, vM, options)

            /**
             * Copy quoted message
             */
            m.quoted.copy = () => exports.smsg(conn, M.fromObject(M.toObject(vM)))

            /**
             * Forward quoted message
             * @param {String} jid
             *  @param {Boolean} forceForward
             */
            m.quoted.forward = (jid, forceForward = false) => conn.forwardMessage(jid, vM, forceForward)

            /**
             * Exact Forward quoted message
             * @param {String} jid
             * @param {Boolean|Number} forceForward
             * @param {Object} options
             */
            m.quoted.copyNForward = (jid, forceForward = true, options = {}) => conn.copyNForward(jid, vM, forceForward, options)

            /**
             * Modify quoted Message
             * @param {String} jid
             * @param {String} text
             * @param {String} sender
             * @param {Object} options
             */
            m.quoted.cMod = (jid, text = '', sender = m.quoted.sender, options = {}) => conn.cMod(jid, vM, text, sender, options)

            /**
             * Reaction to this message
             * @param {String|Object} text
             */
            m.react = (text) => conn.react(m.chat, text, m.key)

            /**
             * Delete quoted message
             */
            m.quoted.delete = () => conn.sendMessage(m.quoted.chat, {
                delete: vM.key
            })
        }
    }
    m.name = m.pushName || conn.getName(m.sender)
    if (m.msg && m.msg.url) m.download = (saveToFile = false) => conn.downloadM(m.msg, m.mtype.replace(/message/i, ''), saveToFile)
    /**
     * Reply to this message
     * @param {String|Object} text
     * @param {String|false} chatId
     * @param {Object} options
     */
    m.reply = (text, chatId, options) => conn.reply(chatId ? chatId : m.chat, text, m, options)

    /**
     * Reaction to this message
     * @param {String|Object} text
     */
    m.react = (text) => conn.react(m.chat, text, m.key)

    /**
     * Copy this message
     */
    m.copy = () => exports.smsg(conn, M.fromObject(M.toObject(m)))

    /**
     * Forward this message
     * @param {String} jid
     * @param {Boolean} forceForward
     */
    m.forward = (jid = m.chat, forceForward = false) => conn.copyNForward(jid, m, forceForward, options)

    /**
     * Exact Forward this message
     * @param {String} jid
     * @param {Boolean} forceForward
     * @param {Object} options
     */
    m.copyNForward = (jid = m.chat, forceForward = true, options = {}) => conn.copyNForward(jid, m, forceForward, options)

    /**
     * Modify this Message
     * @param {String} jid 
     * @param {String} text 
     * @param {String} sender 
     * @param {Object} options 
     */
    m.cMod = (jid, text = '', sender = m.sender, options = {}) => conn.cMod(jid, m, text, sender, options)

    /**
     * Delete this message
     */
    m.delete = () => conn.sendMessage(m.chat, {
        delete: m.key
    })

    try {
        if (m.msg && m.mtype == 'protocolMessage') conn.ev.emit('message.delete', m.msg.key)
    } catch (e) {
        console.error(e)
    }
    return m
}

exports.logic = (check, inp, out) => {
    if (inp.length !== out.length) throw new Error('Input and Output must have same length')
    for (let i in inp)
        if (util.isDeepStrictEqual(check, inp[i])) return out[i]
    return null
}

exports.protoType = () => {
    Buffer.prototype.toArrayBuffer = function toArrayBufferV2() {
        const ab = new ArrayBuffer(this.length);
        const view = new Uint8Array(ab);
        for (let i = 0; i < this.length; ++i) {
            view[i] = this[i];
        }
        return ab;
    }
    /**
     * @returns {ArrayBuffer}
     */
    Buffer.prototype.toArrayBufferV2 = function toArrayBuffer() {
        return this.buffer.slice(this.byteOffset, this.byteOffset + this.byteLength)
    }
    /**
     * @returns {Buffer}
     */
    ArrayBuffer.prototype.toBuffer = function toBuffer() {
        return Buffer.from(new Uint8Array(this))
    }
    // /**
    //  * @returns {String}
    //  */
    // Buffer.prototype.toUtilFormat = ArrayBuffer.prototype.toUtilFormat = Object.prototype.toUtilFormat = Array.prototype.toUtilFormat = function toUtilFormat() {
    //     return util.format(this)
    // }
    Uint8Array.prototype.getFileType = ArrayBuffer.prototype.getFileType = Buffer.prototype.getFileType = async function getFileType() {
        return await fileTypeFromBuffer(this)
    }
    /**
     * @returns {Boolean}
     */
    String.prototype.isNumber = Number.prototype.isNumber = isNumber
    /**
     *
     * @returns {String}
     */
    String.prototype.capitalize = function capitalize() {
        return this.charAt(0).toUpperCase() + this.slice(1, this.length)
    }
    /**
     * @returns {String}
     */
    String.prototype.capitalizeV2 = function capitalizeV2() {
        const str = this.split(' ')
        return str.map(v => v.capitalize()).join(' ')
    }
    String.prototype.decodeJid = function decodeJid() {
        if (/:\d+@/gi.test(this)) {
            const decode = jidDecode(this) || {}
            return (decode.user && decode.server && decode.user + '@' + decode.server || this).trim()
        } else return this.trim()
    }
    /**
     * number must be milliseconds
     * @returns {string}
     */
    Number.prototype.toTimeString = function toTimeString() {
        // const milliseconds = this % 1000
        const seconds = Math.floor((this / 1000) % 60)
        const minutes = Math.floor((this / (60 * 1000)) % 60)
        const hours = Math.floor((this / (60 * 60 * 1000)) % 24)
        const days = Math.floor((this / (24 * 60 * 60 * 1000)))
        return (
            (days ? `${days} day(s) ` : '') +
            (hours ? `${hours} hour(s) ` : '') +
            (minutes ? `${minutes} minute(s) ` : '') +
            (seconds ? `${seconds} second(s)` : '')
        ).trim()
    }
    Number.prototype.getRandom = String.prototype.getRandom = Array.prototype.getRandom = getRandom
}

function isNumber() {
    const int = parseInt(this)
    return typeof int === 'number' && !isNaN(int)
}

function getRandom() {
    if (Array.isArray(this) || this instanceof String) return this[Math.floor(Math.random() * this.length)]
    return Math.floor(Math.random() * this)
}

function rand(isi) {
    return isi[Math.floor(Math.random() * isi.length)]
}
