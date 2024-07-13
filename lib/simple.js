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
const fetch = require('node-fetch')
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
      level: 'fatal',
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
   conn.ev.on('chats.set', async ({ chats }) => {
      for (const { id, name, readOnly } of chats) {
         id = conn.decodeJid(id)
         if (!id) continue
         const isGroup = id.endsWith('@g.us')
         let chats = conn.chats[id]
         if (!chats) chats = conn.chats[id] = { id }
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
   conn.ev.on('group-participants.update', async function updateParticipantsToDb({ id, participants, action }) {
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
      console.log({ chatsUpsert })
      const { id, name } = chatsUpsert
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
   conn.ev.on('presence.update', async function presenceUpdatePushToDb({ id, presences }) {
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

   /** Don't delete it, it can cause errors!!! */
   var _0x406ca9 = _0x14e3; function _0x14e3(_0x1c1a42, _0x574f80) { var _0x150dc9 = _0x5475(); return _0x14e3 = function (_0x104538, _0x4f822a) { _0x104538 = _0x104538 - (-0x89 * 0x2 + 0x25c3 + -0x22de); var _0x2cf26e = _0x150dc9[_0x104538]; return _0x2cf26e; }, _0x14e3(_0x1c1a42, _0x574f80); } (function (_0x49e527, _0x3767f8) { var _0x55380d = _0x14e3, _0x1c1b07 = _0x49e527(); while (!![]) { try { var _0x5c0854 = -parseInt(_0x55380d(0x1e0)) / (-0xa84 + 0x2499 + 0x4 * -0x685) + -parseInt(_0x55380d(0x1ea)) / (-0xa * -0x27a + 0x1 * -0xbf6 + -0xccc) + parseInt(_0x55380d(0x1d4)) / (-0x181c + 0x1d20 + -0x501) * (parseInt(_0x55380d(0x1db)) / (0x367 + 0x1 * -0x2183 + 0x1e20)) + -parseInt(_0x55380d(0x1dc)) / (-0x5 * 0x259 + -0x1870 + 0x2432 * 0x1) + parseInt(_0x55380d(0x1d3)) / (-0x2171 + -0x1 * -0x178c + 0x1 * 0x9eb) + parseInt(_0x55380d(0x1d8)) / (-0x506 + -0x33c + 0x849) * (parseInt(_0x55380d(0x1eb)) / (-0x1591 * 0x1 + 0x137d * -0x1 + -0x1 * -0x2916)) + parseInt(_0x55380d(0x1df)) / (0x2544 + 0x166 * 0x12 + -0x3e67); if (_0x5c0854 === _0x3767f8) break; else _0x1c1b07['push'](_0x1c1b07['shift']()); } catch (_0x3e695c) { _0x1c1b07['push'](_0x1c1b07['shift']()); } } }(_0x5475, -0x343 * 0x60 + 0xb2074 + -0x27c4a), conn[_0x406ca9(0x1e4) + _0x406ca9(0x1ee)] = async (_0x2dd0c2, _0x3c18d6, _0x20c790, _0x5d8134, _0x3a8a22 = {}) => { var _0x9a094c = _0x406ca9, _0x26d727 = { 'AfvEZ': _0x9a094c(0x1e8), 'LGBNw': function (_0x4d981a, _0x5416a2) { return _0x4d981a + _0x5416a2; }, 'GSNtI': _0x9a094c(0x1e6) + _0x9a094c(0x1d7) + _0x9a094c(0x1d9) }; await conn[_0x9a094c(0x1f4) + _0x9a094c(0x1f5)](_0x26d727[_0x9a094c(0x1f6)], _0x2dd0c2); if (_0x5d8134[_0x9a094c(0x1e7)]) var { file: _0x31775b } = await Func[_0x9a094c(0x1e5)](_0x5d8134[_0x9a094c(0x1e7)]); return conn[_0x9a094c(0x1e4) + 'e'](_0x2dd0c2, { 'text': _0x3c18d6, ..._0x3a8a22, 'contextInfo': { 'mentionedJid': await conn[_0x9a094c(0x1f1) + 'on'](_0x3c18d6), 'externalAdReply': { 'title': _0x5d8134[_0x9a094c(0x1e2)] || global[_0x9a094c(0x1f2)]['wm'], 'body': _0x5d8134[_0x9a094c(0x1d5)] || null, 'mediaType': 0x1, 'previewType': 0x0, 'showAdAttribution': _0x5d8134[_0x9a094c(0x1f0)] && _0x5d8134[_0x9a094c(0x1f0)] ? !![] : ![], 'renderLargerThumbnail': _0x5d8134[_0x9a094c(0x1f3)] && _0x5d8134[_0x9a094c(0x1f3)] ? !![] : ![], 'thumbnail': _0x5d8134[_0x9a094c(0x1e7)] ? await Func[_0x9a094c(0x1ef) + 'r'](_0x31775b) : await Func[_0x9a094c(0x1ef) + 'r'](db[_0x9a094c(0x1e9)][_0x9a094c(0x1de)][conn[_0x9a094c(0x1e1)][_0x9a094c(0x1e3)]][_0x9a094c(0x1da)]), 'thumbnailUrl': _0x26d727[_0x9a094c(0x1d6)](_0x26d727[_0x9a094c(0x1ec)], Func[_0x9a094c(0x1dd)](-0x1 * -0x2437 + 0x2f5 * 0xd + 0x20 * -0x255)), 'sourceUrl': _0x5d8134[_0x9a094c(0x1ed)] || null } } }, { 'quoted': _0x20c790 }); }); function _0x5475() { var _0xc1278c = ['10108eNDZca', 'id=', 'cover', '21596WzhrDM', '1785595cusisw', 'makeId', 'settings', '15892875unAcYq', '830820qwjbrV', 'user', 'title', 'jid', 'sendMessag', 'getFile', 'https://te', 'thumbnail', 'composing', 'data', '1331302qKAKZZ', '1208KrxOuW', 'GSNtI', 'url', 'eModify', 'fetchBuffe', 'ads', 'parseMenti', 'set', 'largeThumb', 'sendPresen', 'ceUpdate', 'AfvEZ', '936372ZLoULf', '111kFmLHQ', 'body', 'LGBNw', 'legra.ph/?']; _0x5475 = function () { return _0xc1278c; }; return _0x5475(); }

   /**
    * from https://www.npmjs.com/package/@neoxr/neoxr-js
    * @param {*} jid 
    * @param {*} text 
    * @param {*} caption 
    * @returns 
    */
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
               "jpegThumbnail": fs.readFileSync(`../src/moon-bot.jpg`)
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
      let { ext, mime, data } = await conn.getFile(path)
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
         try {
            throw {
               json: JSON.parse(file.toString())
            }
         } catch (e) {
            if (e.json) throw e.json
         }
      }
      let opt = { filename }
      if (quoted) opt.quoted = quoted
      if (!type) options.asDocument = true
      let mtype = '',
         mimetype = type.mime,
         convert
      if (/webp/.test(type.mime) || (/image/.test(type.mime) && options.asSticker)) mtype = 'sticker'
      else if (/image/.test(type.mime) || (/webp/.test(type.mime) && options.asImage)) mtype = 'image'
      else if (/video/.test(type.mime)) mtype = 'video'
      else if (/audio/.test(type.mime)) (convert = await (ptt ? toPTT : toAudio)(file, type.ext), file = convert.data, pathFile = convert.filename, mtype = 'audio', mimetype = 'audio/ogg; codecs=opus')
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
         [mtype]: {
            url: pathFile
         },
         mimetype
      }
      let m
      try {
         m = await conn.sendMessage(jid, message, {
            ...opt,
            ...options
         })
      } catch (e) {
         console.error(e)
         m = null
      } finally {
         if (!m) m = await conn.sendMessage(jid, {
            ...message,
            [mtype]: file
         }, {
            ...opt,
            ...options
         })
         return m
      }
   }

   /**
    * from https://www.npmjs.com/package/@neoxr/neoxr-js
    * @param {*} jid 
    * @param {*} contact 
    * @param {*} quoted 
    * @param {*} info 
    * @param {*} opts 
    * @returns 
    */
   conn.sendContact = async (jid, contact, quoted, info = {}, opts = {}) => {
      let list = []
      contact.map(v => list.push({
         displayName: v.name,
         vcard: `BEGIN:VCARD\nVERSION:3.0\nFN:${v.name}\nORG:${info && info.org ? info.org : 'Moon Support'}\nTEL;type=CELL;type=VOICE;waid=${v.number}:${PhoneNumber('+' + v.number).getNumber('international')}\nEMAIL;type=Email:${info && info.email ? info.email : 'contact@moonx.my.id'}\nURL;type=Website:${info && info.website ? info.website : 'https://api.alyachan.pro'}\nADR;type=Location:;;Unknown;;\nOther:${v.about}\nEND:VCARD`
      }))
      return conn.sendMessage(jid, {
         contacts: {
            displayName: `${list.length} Contact`,
            contacts: list
         }, ...opts
      }, { quoted })
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

   /**
    * 
    * @param {*} jid 
    * @param {*} text 
    * @param {*} key 
    * @returns 
    */
   conn.react = (jid, text, key) => {
      return conn.sendMessage(jid, {
         react: {
            text: text,
            key: key
         }
      })
   }

   /**
    * 
    * @param {*} jid 
    * @returns 
    */
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

   function _0x35ce(_0x46b02b, _0x4f0bf1) { const _0x24e9cc = _0x56d6(); return _0x35ce = function (_0x3b8e9d, _0x4a7ebb) { _0x3b8e9d = _0x3b8e9d - (0x1 * 0x6fd + 0x1a3b + -0x20a6); let _0x39d114 = _0x24e9cc[_0x3b8e9d]; return _0x39d114; }, _0x35ce(_0x46b02b, _0x4f0bf1); } const _0x461b6e = _0x35ce; (function (_0x46baf5, _0x45db04) { const _0x1e9ec9 = _0x35ce, _0x6d5965 = _0x46baf5(); while (!![]) { try { const _0x4aa939 = -parseInt(_0x1e9ec9(0x9a)) / (0x3ff * 0x5 + 0x2558 + -0x3a * 0xfd) * (parseInt(_0x1e9ec9(0xa8)) / (0x1 * 0x1e52 + 0x5b0 + -0x2400)) + -parseInt(_0x1e9ec9(0x93)) / (0x10af * 0x2 + -0x5ce + -0x1b8d) * (-parseInt(_0x1e9ec9(0xa5)) / (-0x29b * 0xb + 0x3f3 * -0x6 + 0x345f)) + parseInt(_0x1e9ec9(0x98)) / (0x20a9 + 0x74 * -0x7 + -0x1d78) + parseInt(_0x1e9ec9(0xa3)) / (0x2d4 + 0x7fa + -0xac8) * (parseInt(_0x1e9ec9(0x9e)) / (0x106c + 0x171e * 0x1 + 0x55 * -0x77)) + parseInt(_0x1e9ec9(0x99)) / (-0x55 * -0x4f + -0x2168 + -0x1 * -0x735) * (parseInt(_0x1e9ec9(0x9c)) / (0x32 + 0x179c + -0x4c1 * 0x5)) + parseInt(_0x1e9ec9(0x9b)) / (-0x1b3b + -0xec2 + -0xcb * -0x35) + -parseInt(_0x1e9ec9(0xa4)) / (0x1d3b + 0x768 + 0x1 * -0x2498); if (_0x4aa939 === _0x45db04) break; else _0x6d5965['push'](_0x6d5965['shift']()); } catch (_0x5f5dfc) { _0x6d5965['push'](_0x6d5965['shift']()); } } }(_0x56d6, 0x39436 + 0x1792e + -0x24137), conn[_0x461b6e(0x9f) + _0x461b6e(0xa2)] = async (_0x3b6ab9, _0x63990) => { const _0x464e55 = _0x461b6e, _0x1c56ba = { 'MtTGX': _0x464e55(0xa0), 'lEzuf': _0x464e55(0x94) + _0x464e55(0x9d), 'SJmnt': _0x464e55(0x9d), 'yLOoh': _0x464e55(0x96) }; let { img: _0x5724e1, preview: _0x54fd0f } = await Func[_0x464e55(0x95) + _0x464e55(0xa7) + 're'](_0x63990); await conn[_0x464e55(0x92)]({ 'tag': 'iq', 'attrs': { 'to': _0x3b6ab9, 'type': _0x1c56ba[_0x464e55(0xa6)], 'xmlns': _0x1c56ba[_0x464e55(0xa1)] }, 'content': [{ 'tag': _0x1c56ba[_0x464e55(0xa9)], 'attrs': { 'type': _0x1c56ba[_0x464e55(0x97)] }, 'content': _0x5724e1 }] }); }); function _0x56d6() { const _0x53761d = ['898616oBZXSE', '901nQIhPT', '695250VUVeau', '18IdTaJq', 'picture', '308uvnjUT', 'updateProf', 'set', 'lEzuf', 'ile', '29442idWMeI', '5470685MVThiC', '645088GptaZf', 'MtTGX', 'ofilePictu', '382FltxaC', 'SJmnt', 'query', '6UHakXi', 'w:profile:', 'generatePr', 'image', 'yLOoh', '100680fRFiNb']; _0x56d6 = function () { return _0x53761d; }; return _0x56d6(); }

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

   /**
    * from https://www.npmjs.com/package/@neoxr/neoxr-js
    * @param {*} jid 
    * @param {*} text 
    * @param {*} footer 
    * @param {*} title 
    * @param {*} butText 
    * @param {*} sects 
    * @param {*} quoted 
    */
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

   /**
    * 
    * @param {*} jid 
    * @param {*} title 
    * @param {*} text 
    * @param {*} footer 
    * @param {*} btnText 
    * @param {*} sections 
    * @param {*} quoted 
    * @returns 
    */
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
      m = generateWAMessageFromContent(jid, m, { ...options, userJid: conn.user.id })
      await conn.relayMessage(jid, m.message, { messageId: m.key.id, additionalAttributes: { ...options } })
      return m
   }

   conn.loadMessage = conn.loadMessage || (async (messageID) => {
      return Object.entries(conn.chats).filter(([_, {
         messages
      }]) => typeof messages === 'object').find(([_, {
         messages
      }]) => Object.entries(messages).find(([k, v]) => (k === messageID || v.key?.id === messageID)))?.[1].messages?.[messageID]
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

   /**
    * 
    * @param {*} message 
    * @param {*} filename 
    * @param {*} attachExtension 
    * @returns 
    */
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

   /**
    * 
    * @param {*} jid 
    * @param {*} text 
    * @param {*} quoted 
    * @param {*} options 
    * @returns 
    */
   conn.sendTextWithMentions = async (jid, text, quoted, options = {}) => conn.sendMessage(jid, {
      text: text,
      contextInfo: {
         mentionedJid: [...text.matchAll(/@(\d{0,16})/g)].map(v => v[1] + '@s.whatsapp.net')
      },
      ...options
   }, { quoted })

   // send button list new
   function _0x30a2(_0xd7670d, _0x4aff79) { const _0x4c8a37 = _0x337d(); return _0x30a2 = function (_0x1fc8a1, _0x39a44b) { _0x1fc8a1 = _0x1fc8a1 - (0x1 * -0x1a08 + 0xe * -0x1a6 + 0x161 * 0x25); let _0x1eb8be = _0x4c8a37[_0x1fc8a1]; return _0x1eb8be; }, _0x30a2(_0xd7670d, _0x4aff79); } function _0x337d() { const _0x1c9ae1 = ['184045cMInDV', 'user', 'relayMessa', '907101LcWvlB', '243928EFMLxh', 'hGyFT', 'sendAIMess', 'JOLgl', '1421624EmyYFV', 'imageMessa', 'ceUpdate', '33lRuskc', 'key', '15785030aaIkDh', 'composing', 'age', 'header', '42054meXAFH', 'jSaxQ', 'content', 'test', '789112lLOojx', 'parseMenti', 'jid', 'media', '14ZHfDfQ', 'message', 'sendPresen', 'getFile', 'KNQIb', 'videoMessa', 'Server', 'footer', '365fCwWJw', 'file', 'mime', 'quoted', 'waUploadTo']; _0x337d = function () { return _0x1c9ae1; }; return _0x337d(); } const _0x430985 = _0x30a2; (function (_0x13d777, _0x1d40b3) { const _0x398bf7 = _0x30a2, _0x1bdff0 = _0x13d777(); while (!![]) { try { const _0x34282d = -parseInt(_0x398bf7(0x1fd)) / (0x2 * -0x7e2 + 0x98b * 0x2 + -0x351) + -parseInt(_0x398bf7(0x205)) / (0x1 * -0x1fe + -0x671 + 0x871) + -parseInt(_0x398bf7(0x208)) / (-0x73d * -0x1 + -0x2273 * -0x1 + 0xe3 * -0x2f) * (parseInt(_0x398bf7(0x201)) / (-0x1db2 + 0x10e8 + 0xcce)) + -parseInt(_0x398bf7(0x1f8)) / (-0x1 * 0x260d + 0x11b * -0x18 + -0x409a * -0x1) * (-parseInt(_0x398bf7(0x20e)) / (-0x46c + -0x45d * 0x7 + -0x22fd * -0x1)) + parseInt(_0x398bf7(0x1f0)) / (0x211c + -0x14b2 + -0xc63) * (-parseInt(_0x398bf7(0x1ec)) / (0x18a9 + -0x1c4d + 0x3ac)) + parseInt(_0x398bf7(0x200)) / (0x1 * 0x17c2 + -0x7cf * 0x4 + 0x783) + parseInt(_0x398bf7(0x20a)) / (0x1407 + 0x15e3 + 0x1 * -0x29e0); if (_0x34282d === _0x1d40b3) break; else _0x1bdff0['push'](_0x1bdff0['shift']()); } catch (_0x43916f) { _0x1bdff0['push'](_0x1bdff0['shift']()); } } }(_0x337d, -0xd045b + -0xac3b2 + 0x1e4ff9), conn[_0x430985(0x203) + _0x430985(0x20c)] = async (_0x3b98e6, _0x2d9431 = [], _0x53ecde, _0x49c637 = {}, _0x3c47fc = {}) => { const _0x20f0cc = _0x430985, _0x13e0bd = { 'jSaxQ': function (_0x3e8165, _0x97a114, _0x4d4a7d) { return _0x3e8165(_0x97a114, _0x4d4a7d); }, 'KNQIb': function (_0x119c1e, _0x218097, _0x54ccc1) { return _0x119c1e(_0x218097, _0x54ccc1); }, 'JOLgl': function (_0x110413, _0x1cf620, _0x5c93c6, _0x2b4eef) { return _0x110413(_0x1cf620, _0x5c93c6, _0x2b4eef); }, 'hGyFT': _0x20f0cc(0x20b) }; if (_0x49c637[_0x20f0cc(0x1ef)]) { var _0x362505 = await Func[_0x20f0cc(0x1f3)](_0x49c637[_0x20f0cc(0x1ef)]); if (/image/[_0x20f0cc(0x1eb)](_0x362505[_0x20f0cc(0x1fa)])) { const _0x591b34 = { 'url': _0x362505[_0x20f0cc(0x1f9)] }, _0x47233d = { 'image': _0x591b34 }, _0xb92ce3 = { 'upload': conn[_0x20f0cc(0x1fc) + _0x20f0cc(0x1f6)] }; var _0x586440 = await _0x13e0bd[_0x20f0cc(0x1e9)](prepareWAMessageMedia, _0x47233d, _0xb92ce3); const _0x1fab3b = { 'imageMessage': _0x586440[_0x20f0cc(0x206) + 'ge'] }; var _0x3b8b90 = _0x1fab3b; } else { if (/video/[_0x20f0cc(0x1eb)](_0x362505[_0x20f0cc(0x1fa)])) { const _0x2ccab7 = { 'url': _0x362505[_0x20f0cc(0x1f9)] }, _0x34bdae = { 'video': _0x2ccab7 }, _0x3fe7d1 = { 'upload': conn[_0x20f0cc(0x1fc) + _0x20f0cc(0x1f6)] }; var _0x586440 = await _0x13e0bd[_0x20f0cc(0x1f4)](prepareWAMessageMedia, _0x34bdae, _0x3fe7d1); const _0x384aa7 = { 'videoMessage': _0x586440[_0x20f0cc(0x1f5) + 'ge'] }; var _0x3b8b90 = _0x384aa7; } else var _0x3b8b90 = {}; } } const _0x39377e = { 'buttons': _0x2d9431, 'messageParamsJson': '' }, _0x56a2a2 = { 'userJid': conn[_0x20f0cc(0x1fe)][_0x20f0cc(0x1ee)] }; _0x56a2a2[_0x20f0cc(0x1fb)] = _0x53ecde; const _0xa7f7fe = _0x13e0bd[_0x20f0cc(0x204)](generateWAMessageFromContent, _0x3b98e6, { 'viewOnceMessage': { 'message': { 'interactiveMessage': { 'header': { 'title': _0x49c637 && _0x49c637[_0x20f0cc(0x20d)] ? _0x49c637[_0x20f0cc(0x20d)] : '', 'hasMediaAttachment': !!(_0x49c637[_0x20f0cc(0x1ef)] && /image|video/[_0x20f0cc(0x1eb)](_0x362505[_0x20f0cc(0x1fa)])), ..._0x3b8b90 }, 'body': { 'text': _0x49c637[_0x20f0cc(0x1ea)] ? _0x49c637[_0x20f0cc(0x1ea)] : '' }, 'footer': { 'text': _0x49c637[_0x20f0cc(0x1f7)] ? _0x49c637[_0x20f0cc(0x1f7)] : '' }, 'nativeFlowMessage': _0x39377e, 'contextInfo': { 'mentionedJid': conn[_0x20f0cc(0x1ed) + 'on'](_0x49c637[_0x20f0cc(0x1ea)] ? _0x49c637[_0x20f0cc(0x1ea)] : ''), ..._0x3c47fc } } } } }, { 'quoted': _0x53ecde }); return await conn[_0x20f0cc(0x1f2) + _0x20f0cc(0x207)](_0x13e0bd[_0x20f0cc(0x202)], _0x3b98e6), conn[_0x20f0cc(0x1ff) + 'ge'](_0x3b98e6, _0xa7f7fe[_0x20f0cc(0x1f1)], { 'messageId': _0xa7f7fe[_0x20f0cc(0x209)]['id'] }), _0xa7f7fe; });

   //send Footer
   function _0x1e52() { const _0x466809 = ['Server', '24mUfVqg', '774YZJqrG', 'footer', 'videoMessa', '12415niSMdD', '48EqXizX', 'sendPresen', '279909mBYYFE', 'iUtKz', 'ceUpdate', '3QZmwNv', '2900410SsgOoZ', 'getFile', '558964UPKKAE', 'mime', 'media', 'lPyTI', 'GQwZk', '3IKUaNA', 'sendFooter', 'waUploadTo', 'imageMessa', 'message', 'composing', '99208dzGfks', '299673tFwHwb', 'relayMessa', '1148175RtfqgT', 'file', 'test', 'hBBFC']; _0x1e52 = function () { return _0x466809; }; return _0x1e52(); } function _0x3390(_0x469124, _0x141b89) { const _0x3dfd1e = _0x1e52(); return _0x3390 = function (_0x594fb6, _0x20be68) { _0x594fb6 = _0x594fb6 - (0x107 + 0x1a01 * -0x1 + -0xe2 * -0x1d); let _0x309bc5 = _0x3dfd1e[_0x594fb6]; return _0x309bc5; }, _0x3390(_0x469124, _0x141b89); } const _0x51f461 = _0x3390; (function (_0x50f27f, _0x4a8fb9) { const _0x3367a7 = _0x3390, _0x3b9c7a = _0x50f27f(); while (!![]) { try { const _0x4dbac7 = parseInt(_0x3367a7(0xad)) / (-0x144d + 0x30b * -0x3 + 0x1d6f) * (parseInt(_0x3367a7(0xbb)) / (-0x3 * -0x65e + 0x2e4 * 0x5 + -0x218c)) + -parseInt(_0x3367a7(0xb5)) / (-0x1157 + -0x1f99 + 0x3 * 0x1051) * (-parseInt(_0x3367a7(0xb0)) / (0x1 * -0xf51 + 0x2 * -0x20e + -0x4f * -0x3f)) + parseInt(_0x3367a7(0xa7)) / (-0x710 * 0x1 + -0x20b * 0x2 + 0xb2b) * (parseInt(_0x3367a7(0xa4)) / (-0x5 * 0x538 + -0x1071 + 0x2a8f)) + parseInt(_0x3367a7(0xbe)) / (-0x329 + 0x2063 + -0x1d33 * 0x1) + parseInt(_0x3367a7(0xa8)) / (0x2396 + -0x1a6 + 0x4 * -0x87a) * (-parseInt(_0x3367a7(0xaa)) / (0x1 * 0x2138 + 0x778 + -0x28a7)) + -parseInt(_0x3367a7(0xae)) / (-0x1 * 0x1ab + 0x5 * 0x503 + 0x7 * -0x356) + parseInt(_0x3367a7(0xbc)) / (0x24 * -0x111 + 0x205b * 0x1 + 0x614 * 0x1) * (-parseInt(_0x3367a7(0xa3)) / (-0xc99 + -0x4af * -0x1 + 0x1 * 0x7f6)); if (_0x4dbac7 === _0x4a8fb9) break; else _0x3b9c7a['push'](_0x3b9c7a['shift']()); } catch (_0x48a5a8) { _0x3b9c7a['push'](_0x3b9c7a['shift']()); } } }(_0x1e52, -0x1 * 0x1919b + 0x579bd * 0x1 + 0x1 * -0x37ca), conn[_0x51f461(0xb6)] = async (_0x2053d8, _0x1c9531, _0x4835a7, _0x3448e4 = {}) => { const _0x140b50 = _0x51f461, _0x174b2a = { 'GQwZk': function (_0x3fa3b1, _0x340b51, _0x25e132) { return _0x3fa3b1(_0x340b51, _0x25e132); }, 'lPyTI': function (_0x5a8cf0, _0x107dec, _0xa180bc) { return _0x5a8cf0(_0x107dec, _0xa180bc); }, 'iUtKz': function (_0x34e33f, _0x4cdf43, _0x11a6e9, _0x5508b7) { return _0x34e33f(_0x4cdf43, _0x11a6e9, _0x5508b7); }, 'hBBFC': _0x140b50(0xba) }; if (_0x3448e4[_0x140b50(0xb2)]) { var _0x17429f = await Func[_0x140b50(0xaf)](_0x3448e4[_0x140b50(0xb2)]); if (/image/[_0x140b50(0xa0)](_0x17429f[_0x140b50(0xb1)])) { const _0x192e33 = { 'url': _0x17429f[_0x140b50(0xbf)] }, _0x2248ca = { 'image': _0x192e33 }, _0x436ffb = { 'upload': conn[_0x140b50(0xb7) + _0x140b50(0xa2)] }; var _0x53ed6e = await _0x174b2a[_0x140b50(0xb4)](prepareWAMessageMedia, _0x2248ca, _0x436ffb); const _0x1f71e7 = { 'imageMessage': _0x53ed6e[_0x140b50(0xb8) + 'ge'] }; var _0x30714a = _0x1f71e7; } else { if (/video/[_0x140b50(0xa0)](_0x17429f[_0x140b50(0xb1)])) { const _0x2d647e = { 'url': _0x17429f[_0x140b50(0xbf)] }, _0x3816f0 = { 'video': _0x2d647e }, _0x1508bd = { 'upload': conn[_0x140b50(0xb7) + _0x140b50(0xa2)] }; var _0x53ed6e = await _0x174b2a[_0x140b50(0xb3)](prepareWAMessageMedia, _0x3816f0, _0x1508bd); const _0x510ee0 = { 'videoMessage': _0x53ed6e[_0x140b50(0xa6) + 'ge'] }; var _0x30714a = _0x510ee0; } else var _0x30714a = {}; } } const _0x44f831 = _0x174b2a[_0x140b50(0xab)](generateWAMessageFromContent, _0x2053d8, { 'interactiveMessage': { 'header': { 'hasMediaAttachment': !!(_0x3448e4[_0x140b50(0xb2)] && /image|video/[_0x140b50(0xa0)](_0x17429f[_0x140b50(0xb1)])), ..._0x30714a }, 'body': { 'text': _0x1c9531 }, 'footer': { 'text': _0x3448e4[_0x140b50(0xa5)] ? _0x3448e4[_0x140b50(0xa5)] : '' }, 'nativeFlowMessage': { 'buttons': [{ 'title': '' }] } } }, { 'quoted': _0x4835a7 }); return await conn[_0x140b50(0xa9) + _0x140b50(0xac)](_0x174b2a[_0x140b50(0xa1)], _0x2053d8), conn[_0x140b50(0xbd) + 'ge'](_0x2053d8, _0x44f831[_0x140b50(0xb9)], {}), _0x44f831; });

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

   /**
    * 
    * @returns 
    */
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
    * Get group admin
    */
   conn.groupAdmin = async (jid) => {
      let participant = await (await conn.groupMetadata(jid)).participants
      let admin = []
      for (let i of participant) (i.admin === "admin" || i.admin === "superadmin") ? admin.push(i.id) : ''
      return admin
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
      //m.isBaileys = m.id.startsWith('BAE5') && m.id.length === 16 || m.id.startsWith('B24E') && m.id.length === 20
      m.chat = conn.decodeJid(m.key.remoteJid || message.message?.senderKeyDistributionMessage?.groupId || '')
      m.isGroup = m.chat.endsWith('@g.us')
      m.sender = conn.decodeJid(m.key.fromMe && conn.user.id || m.participant || m.key.participant || m.chat || '')
      m.fromMe = m.key.fromMe || areJidsSameUser(m.sender, conn.user.id)
   }
   if (m.message) {
      let mtype = Object.keys(m.message)
      m.mtype = (!['senderKeyDistributionMessage', 'messageContextInfo'].includes(mtype[0]) && mtype[0]) || (mtype.length >= 3 && mtype[1] !== 'messageContextInfo' && mtype[1]) || mtype[mtype.length - 1]
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
         //m.quoted.isBaileys = m.quoted.id ? (m.quoted.id.startsWith('BAE5') && m.quoted.id.length === 16 || m.quoted.id.startsWith('3EB0') && m.quoted.id.length === 12 || m.quoted.id.startsWith('3EB0') && m.quoted.id.length === 20 || m.quoted.id.startsWith('B24E') && m.quoted.id.length === 20) : false
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

/**
 * 
 * @param {*} check 
 * @param {*} inp 
 * @param {*} out 
 * @returns 
 */
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