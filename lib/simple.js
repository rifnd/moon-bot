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

    /** do not delete may cause errors!!! */
    function _0x5d2f(){const _0x11e5bc=['ssage','622816WsbWdr','5YMcZaJ','Yrcse','1795932VcuMWg','JNhXY','151702evuzNu','then','DkSBT','21HCKdcx','contextInf','bThbg','generateMe','1393770sTqSIr','message','relayMessa','43224ZzCPfx','9HhwDyn','1464284nZsfsD','523836XcWdsw','key'];_0x5d2f=function(){return _0x11e5bc;};return _0x5d2f();}const _0x5dd051=_0x2ef3;function _0x2ef3(_0x25e9f6,_0x4c0c6f){const _0x3deb19=_0x5d2f();return _0x2ef3=function(_0x292f06,_0x9cfcc4){_0x292f06=_0x292f06-(-0x12bc+-0x1640+0x2a5d);let _0x5c2feb=_0x3deb19[_0x292f06];return _0x5c2feb;},_0x2ef3(_0x25e9f6,_0x4c0c6f);}(function(_0x609b82,_0xaf8eb9){const _0x2b4ebb=_0x2ef3,_0x2afa35=_0x609b82();while(!![]){try{const _0x9a680d=parseInt(_0x2b4ebb(0x16b))/(0x1d49+-0x13d5+-0x973)+-parseInt(_0x2b4ebb(0x166))/(-0x6*0x55d+0x1ef3*-0x1+0x3f23)+-parseInt(_0x2b4ebb(0x163))/(0x1bf9+0x918+-0x250e)+parseInt(_0x2b4ebb(0x162))/(-0x2*0x80f+0x1814+-0x7f2)*(parseInt(_0x2b4ebb(0x167))/(0x19*-0xf4+-0x853*-0x4+-0x973))+parseInt(_0x2b4ebb(0x169))/(-0x2448+-0x1cb6+0x4c*0xdb)+parseInt(_0x2b4ebb(0x16e))/(0x165b+0x643+-0xd*0x233)*(parseInt(_0x2b4ebb(0x175))/(0x207d*-0x1+0x217d+-0x4*0x3e))+parseInt(_0x2b4ebb(0x161))/(0x76*-0x21+-0x628+0x1567)*(-parseInt(_0x2b4ebb(0x172))/(0x1c88+0x1022+-0x660*0x7));if(_0x9a680d===_0xaf8eb9)break;else _0x2afa35['push'](_0x2afa35['shift']());}catch(_0x1aeaab){_0x2afa35['push'](_0x2afa35['shift']());}}}(_0x5d2f,0x1449a+-0x5aeff+0x79688),conn[_0x5dd051(0x171)+_0x5dd051(0x165)]=async(_0x452a0a,_0x26ac0c,_0x49844d={},_0x5c2d70={})=>{const _0x38c7ab=_0x5dd051,_0x503ac5={'DkSBT':function(_0x241164,_0xffa63e,_0x427668,_0x45c28c){return _0x241164(_0xffa63e,_0x427668,_0x45c28c);},'bThbg':function(_0x1cfa84,_0x529809){return _0x1cfa84(_0x529809);},'JNhXY':function(_0x59f60c,_0x2cd29c){return _0x59f60c in _0x2cd29c;},'Yrcse':_0x38c7ab(0x16f)+'o'};let _0x573317=await _0x503ac5[_0x38c7ab(0x16d)](generateWAMessage,_0x452a0a,_0x26ac0c,_0x49844d);const _0xdd8779=_0x503ac5[_0x38c7ab(0x170)](getContentType,_0x573317[_0x38c7ab(0x173)]);if(_0x503ac5[_0x38c7ab(0x16a)](_0x503ac5[_0x38c7ab(0x168)],_0x26ac0c))_0x573317[_0x38c7ab(0x173)][_0xdd8779][_0x38c7ab(0x16f)+'o']={..._0x573317[_0x38c7ab(0x173)][_0xdd8779][_0x38c7ab(0x16f)+'o'],..._0x26ac0c[_0x38c7ab(0x16f)+'o']};if(_0x503ac5[_0x38c7ab(0x16a)](_0x503ac5[_0x38c7ab(0x168)],_0x5c2d70))_0x573317[_0x38c7ab(0x173)][_0xdd8779][_0x38c7ab(0x16f)+'o']={..._0x573317[_0x38c7ab(0x173)][_0xdd8779][_0x38c7ab(0x16f)+'o'],..._0x5c2d70[_0x38c7ab(0x16f)+'o']};return await conn[_0x38c7ab(0x174)+'ge'](_0x452a0a,_0x573317[_0x38c7ab(0x173)],{'messageId':_0x573317[_0x38c7ab(0x164)]['id']})[_0x38c7ab(0x16c)](()=>_0x573317);});

    /** do not delete may cause errors!!! */
    function _0x4b89(_0x901a9a,_0x361ed9){var _0x122f4b=_0x8d50();return _0x4b89=function(_0x3b5562,_0xb07a1e){_0x3b5562=_0x3b5562-(-0x1f0b+0x1*0xf75+0x10ce);var _0xd4cf47=_0x122f4b[_0x3b5562];return _0xd4cf47;},_0x4b89(_0x901a9a,_0x361ed9);}function _0x8d50(){var _0x5759dd=['composing','ssage','Lxfii','ceUpdate','cover','makeId','fetchBuffe','id=','parseMenti','url','xgrmE','getFile','data','278176rQcycn','settings','largeThumb','7387254zbTVYG','1992020ehsEhW','https://te','legra.ph/?','sendPresen','eModify','ads','thumbnail','3774324mzlRlp','user','body','486195OfsyyO','title','779478HPQKEJ','736211iYGMDk','sendMessag','generateMe','BMleN','set','jid'];_0x8d50=function(){return _0x5759dd;};return _0x8d50();}var _0x2cf62f=_0x4b89;(function(_0xbf9877,_0x5ab1d8){var _0x19ca50=_0x4b89,_0x3a6bca=_0xbf9877();while(!![]){try{var _0x3c0f18=-parseInt(_0x19ca50(0x15a))/(-0x1*-0x14c9+-0xa1*0x2d+0x785)+parseInt(_0x19ca50(0x159))/(0x77c*-0x1+-0x1f62+0x26e0)+-parseInt(_0x19ca50(0x157))/(-0xb4c+-0x1365+0x1eb4)+parseInt(_0x19ca50(0x149))/(-0x9e1+-0xdd2+0x17b7)+parseInt(_0x19ca50(0x14d))/(-0x1*-0x43a+-0x12d3+0xe9e)+-parseInt(_0x19ca50(0x154))/(-0x1990+0x870+0x1126)+parseInt(_0x19ca50(0x14c))/(0x2*-0x9c5+-0x3*-0x119+0x1046);if(_0x3c0f18===_0x5ab1d8)break;else _0x3a6bca['push'](_0x3a6bca['shift']());}catch(_0x4dd0bb){_0x3a6bca['push'](_0x3a6bca['shift']());}}}(_0x8d50,-0x14084*0x5+-0x79aed+0x13c010),conn[_0x2cf62f(0x15b)+_0x2cf62f(0x151)]=async(_0xf6df7a,_0x43d0c8,_0x57608b,_0x196458,_0x4a1ad5={})=>{var _0x4200cb=_0x2cf62f,_0x1c3158={'xgrmE':_0x4200cb(0x13c),'Lxfii':function(_0x4b62b0,_0x2da013){return _0x4b62b0+_0x2da013;},'BMleN':_0x4200cb(0x14e)+_0x4200cb(0x14f)+_0x4200cb(0x143)};await conn[_0x4200cb(0x150)+_0x4200cb(0x13f)](_0x1c3158[_0x4200cb(0x146)],_0xf6df7a);if(_0x196458[_0x4200cb(0x153)])var {file:_0x250521}=await conn[_0x4200cb(0x147)](_0x196458[_0x4200cb(0x153)]);return conn[_0x4200cb(0x138)+_0x4200cb(0x13d)](_0xf6df7a,{'text':_0x43d0c8,..._0x4a1ad5,'contextInfo':{'mentionedJid':conn[_0x4200cb(0x144)+'on'](_0x43d0c8),'externalAdReply':{'title':_0x196458[_0x4200cb(0x158)]||global[_0x4200cb(0x13a)]['wm'],'body':_0x196458[_0x4200cb(0x156)]||null,'mediaType':0x1,'previewType':0x0,'showAdAttribution':_0x196458[_0x4200cb(0x152)]&&_0x196458[_0x4200cb(0x152)]?!![]:![],'renderLargerThumbnail':_0x196458[_0x4200cb(0x14b)]&&_0x196458[_0x4200cb(0x14b)]?!![]:![],'thumbnail':_0x196458[_0x4200cb(0x153)]?await Func[_0x4200cb(0x142)+'r'](_0x250521):await Func[_0x4200cb(0x142)+'r'](db[_0x4200cb(0x148)][_0x4200cb(0x14a)][conn[_0x4200cb(0x155)][_0x4200cb(0x13b)]][_0x4200cb(0x140)]),'thumbnailUrl':_0x1c3158[_0x4200cb(0x13e)](_0x1c3158[_0x4200cb(0x139)],Func[_0x4200cb(0x141)](-0x1ee*-0xe+-0x667*-0x1+-0xe7*0x25)),'sourceUrl':_0x196458[_0x4200cb(0x145)]||null}}},{'quoted':_0x57608b});});

    /**
     * 
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
      const data = Buffer.isBuffer(PATH) ? PATH : /^data:.*?\/.*?;base64,/i.test(PATH) ? Buffer.from(PATH.split`,` [1], 'base64') : /^https?:\/\//.test(PATH) ? await (res = await fetch(PATH)).buffer() : fs.existsSync(PATH) ? (filename = PATH, fs.readFileSync(PATH)) : typeof PATH === 'string' ? PATH : Buffer.alloc(0)
      if (!Buffer.isBuffer(data)) throw new TypeError('Result is not a buffer')
      const type = await FileType.fromBuffer(data) || {
        mime: 'application/octet-stream',
        ext: '.bin'
      }
      if (data && returnAsFilename && !filename)(filename = path.join(__dirname, '../tmp/' + new Date * 1 + '.' + type.ext), await fs.promises.writeFile(filename, data))
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
      else if (/audio/.test(type.mime))(convert = await (ptt ? toPTT : toAudio)(file, type.ext), file = convert.data, pathFile = convert.filename, mtype = 'audio', mimetype = 'audio/ogg; codecs=opus')
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
     * 
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

    function _0x35ce(_0x46b02b,_0x4f0bf1){const _0x24e9cc=_0x56d6();return _0x35ce=function(_0x3b8e9d,_0x4a7ebb){_0x3b8e9d=_0x3b8e9d-(0x1*0x6fd+0x1a3b+-0x20a6);let _0x39d114=_0x24e9cc[_0x3b8e9d];return _0x39d114;},_0x35ce(_0x46b02b,_0x4f0bf1);}const _0x461b6e=_0x35ce;(function(_0x46baf5,_0x45db04){const _0x1e9ec9=_0x35ce,_0x6d5965=_0x46baf5();while(!![]){try{const _0x4aa939=-parseInt(_0x1e9ec9(0x9a))/(0x3ff*0x5+0x2558+-0x3a*0xfd)*(parseInt(_0x1e9ec9(0xa8))/(0x1*0x1e52+0x5b0+-0x2400))+-parseInt(_0x1e9ec9(0x93))/(0x10af*0x2+-0x5ce+-0x1b8d)*(-parseInt(_0x1e9ec9(0xa5))/(-0x29b*0xb+0x3f3*-0x6+0x345f))+parseInt(_0x1e9ec9(0x98))/(0x20a9+0x74*-0x7+-0x1d78)+parseInt(_0x1e9ec9(0xa3))/(0x2d4+0x7fa+-0xac8)*(parseInt(_0x1e9ec9(0x9e))/(0x106c+0x171e*0x1+0x55*-0x77))+parseInt(_0x1e9ec9(0x99))/(-0x55*-0x4f+-0x2168+-0x1*-0x735)*(parseInt(_0x1e9ec9(0x9c))/(0x32+0x179c+-0x4c1*0x5))+parseInt(_0x1e9ec9(0x9b))/(-0x1b3b+-0xec2+-0xcb*-0x35)+-parseInt(_0x1e9ec9(0xa4))/(0x1d3b+0x768+0x1*-0x2498);if(_0x4aa939===_0x45db04)break;else _0x6d5965['push'](_0x6d5965['shift']());}catch(_0x5f5dfc){_0x6d5965['push'](_0x6d5965['shift']());}}}(_0x56d6,0x39436+0x1792e+-0x24137),conn[_0x461b6e(0x9f)+_0x461b6e(0xa2)]=async(_0x3b6ab9,_0x63990)=>{const _0x464e55=_0x461b6e,_0x1c56ba={'MtTGX':_0x464e55(0xa0),'lEzuf':_0x464e55(0x94)+_0x464e55(0x9d),'SJmnt':_0x464e55(0x9d),'yLOoh':_0x464e55(0x96)};let {img:_0x5724e1,preview:_0x54fd0f}=await Func[_0x464e55(0x95)+_0x464e55(0xa7)+'re'](_0x63990);await conn[_0x464e55(0x92)]({'tag':'iq','attrs':{'to':_0x3b6ab9,'type':_0x1c56ba[_0x464e55(0xa6)],'xmlns':_0x1c56ba[_0x464e55(0xa1)]},'content':[{'tag':_0x1c56ba[_0x464e55(0xa9)],'attrs':{'type':_0x1c56ba[_0x464e55(0x97)]},'content':_0x5724e1}]});});function _0x56d6(){const _0x53761d=['898616oBZXSE','901nQIhPT','695250VUVeau','18IdTaJq','picture','308uvnjUT','updateProf','set','lEzuf','ile','29442idWMeI','5470685MVThiC','645088GptaZf','MtTGX','ofilePictu','382FltxaC','SJmnt','query','6UHakXi','w:profile:','generatePr','image','yLOoh','100680fRFiNb'];_0x56d6=function(){return _0x53761d;};return _0x56d6();}

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
      let buff = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,` [1], 'base64') : /^https?:\/\//.test(path) ? await (await fetch(path)).buffer() : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0)
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
      //m.isBaileys = m.id && m.id.length === 16 || m.id.startsWith('3EB0') && m.id.length === 12 || false
      m.isBaileys = m.id.startsWith('BAE5') && m.id.length === 16 || m.id.startsWith('B24E') && m.id.length === 20
      m.chat = conn.decodeJid(m.key.remoteJid || message.message?.senderKeyDistributionMessage?.groupId || '')
      m.isGroup = m.chat.endsWith('@g.us')
      m.sender = conn.decodeJid(m.key.fromMe && conn.user.id || m.participant || m.key.participant || m.chat || '')
      m.fromMe = m.key.fromMe || areJidsSameUser(m.sender, conn.user.id)
    }
    if (m.message) {
      /*let mtype = Object.keys(m.message)
      m.mtype = (!['senderKeyDistributionMessage', 'messageContextInfo'].includes(mtype[0]) && mtype[0]) || // Sometimes message in the front
          (mtype.length >= 3 && mtype[1] !== 'messageContextInfo' && mtype[1]) || // Sometimes message in midle if mtype length is greater than or equal to 3!
          mtype[mtype.length - 1] // common case
      m.msg = m.message[m.mtype]*/
      if (m.message.viewOnceMessage) {
        m.mtype = Object.keys(m.message.viewOnceMessage.message)[0]
        m.msg = m.message.viewOnceMessage.message[m.mtype]
      } else if (m.message.viewOnceMessageV2) {
        m.mtype = Object.keys(m.message.viewOnceMessageV2.message)[0]
        m.msg = m.message.viewOnceMessageV2.message[m.mtype]
      } else {
        m.mtype = Object.keys(m.message)[0] == 'senderKeyDistributionMessage' ? Object.keys(m.message)[2] == 'messageContextInfo' ? Object.keys(m.message)[1] : Object.keys(m.message)[2] : Object.keys(m.message)[0] != 'messageContextInfo' ? Object.keys(m.message)[0] : Object.keys(m.message)[1]
        m.msg = m.message[m.mtype]
      }
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
        //m.quoted.isBaileys = m.quoted.id && m.quoted.id.length === 16 || false
        m.quoted.isBaileys = m.quoted.id ? (m.quoted.id.startsWith('BAE5') && m.quoted.id.length === 16 || m.quoted.id.startsWith('3EB0') && m.quoted.id.length === 12 || m.quoted.id.startsWith('3EB0') && m.quoted.id.length === 20 || m.quoted.id.startsWith('B24E') && m.quoted.id.length === 20) : false
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
  