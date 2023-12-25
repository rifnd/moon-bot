const simple = require('./lib/simple')
const util = require('util')
const isNumber = x => typeof x === 'number' && !isNaN(x)
const delay = ms => isNumber(ms) && new Promise(resolve => setTimeout(resolve, ms))

module.exports = {
  async handler(chatUpdate) {
    this.msgqueque = this.msgqueque || []
    if (!chatUpdate) return
    let m = chatUpdate.messages[chatUpdate.messages.length - 1]
    if (!m) return
    if (m.message?.viewOnceMessageV2) m.message = m.message.viewOnceMessageV2.message
    if (m.message?.documentWithCaptionMessage) m.message = m.message.documentWithCaptionMessage.message
    if (m.message?.viewOnceMessageV2Extension) m.message = m.message.viewOnceMessageV2Extension.message
    if (db.data == null) await loadDatabase()
    
    try {
      m = simple.smsg(this, m) || m
      if (!m) return
      // console.log(m)
      m.exp = 0
      m.limit = false
      try {
        let user = db.data.users[m.sender]
        if (typeof user !== 'object') db.data.users[m.sender] = {}
        if (user) {
          if (!('registered' in user)) user.registered = false
          if (!user.registered) {
            if (!('name' in user)) user.name = m.name
            if (!isNumber(user.age)) user.age = -1
            if (!isNumber(user.regTime)) user.regTime = -1
          }
          if (!isNumber(user.exp)) user.exp = 1000
          if (!isNumber(user.exp)) user.money = 1000
          if (!isNumber(user.limit)) user.limit = 100
          if (!isNumber(user.bank)) user.bank = 1000
          if (!isNumber(user.lastclaim)) user.lastclaim = -1
          if (!isNumber(user.afk)) user.afk = -1
          if (!('afkReason' in user)) user.afkReason = ''
          if (!('afkObj' in user)) user.afkObj = {}
          if (!('partner' in user)) user.partner = ''
          if (!('taken' in user)) user.taken = false
          if (!('banned' in user)) user.banned = false
          if (!isNumber(user.bannedTime)) user.bannedTime = -1
          if (!('premium' in user)) user.premium = false
          if (!isNumber(user.premiumTime)) user.premiumTime = -1
          if (!isNumber(user.level)) user.level = 0
          if (!('role' in user)) user.role = 'Beginner'
          if (!isNumber(user.warn)) user.warn = 0
          if (!isNumber(user.pc)) user.pc = -1
          if (!isNumber(user.reglast)) user.reglast = -1
          if (!isNumber(user.unreglast)) user.unreglast = -1
          if (!isNumber(user.snlast)) user.snlast = -1
          if (!isNumber(user.hit)) user.hit = 0
          if (!isNumber(user.lastseen)) user.lastseen = 0
          if (!isNumber(user.usebot)) user.usebot = 0
        } else db.data.users[m.sender] = {
          registered: false,
          name: m.name,
          age: -1,
          regTime: -1,
          exp: 1000,
          money: 1000,
          limit: 100,
          bank: 1000,
          lastclaim: -1,
          afk: -1,
          afkReason: '',
          afkObj: {},
          partner: '',
          taken: false,
          banned: false,
          bannedTime: -1,
          premium: false,
          premiumTime: -1,
          level: 0,
          role: 'Begginer',
          warn: 0,
          pc: -1,
          reglast: -1,
          unreglast: -1,
          snlast: -1,
          hit: 0,
          lastseen: 0,
          usebot: 0
        }

        /** chats schema */
        let chat = db.data.chats[m.chat]
        if (typeof chat !== 'object') db.data.chats[m.chat] = {}
        if (chat) {
          if (!('isBanned' in chat)) chat.isBanned = false
          if (!('welcome' in chat)) chat.welcome = false
          if (!('detect' in chat)) chat.detect = false
          if (!('sWelcome' in chat)) chat.sWelcome = ''
          if (!('sBye' in chat)) chat.sBye = ''
          if (!('sPromote' in chat)) chat.sPromote = ''
          if (!('sDemote' in chat)) chat.sDemote = ''
          if (!('antidelete' in chat)) chat.antidelete = true
          if (!('antilink' in chat)) chat.antilink = false
          if (!('antisticker' in chat)) chat.antisticker = false
          if (!('autosticker' in chat)) chat.autosticker = false
          if (!('viewonce' in chat)) chat.viewonce = false
          if (!('antitoxic' in chat)) chat.antitoxic = false
          if (!isNumber(chat.expired)) chat.expired = 0
          if (!('member' in chat)) chat.member = {}
          if (!isNumber(chat.chat)) chat.chat = 0
          if (!isNumber(chat.lastchat)) chat.lastchat = 0
          if (!isNumber(chat.lastseen)) chat.lastseen = 0
        } else db.data.chats[m.chat] = {
          isBanned: false,
          welcome: false,
          detect: false,
          sWelcome: '',
          sBye: '',
          sPromote: '',
          sDemote: '',
          antidelete: true,
          antilink: false,
          antistiker: false,
          autosticker: false,
          viewonce: false,
          antitoxic: false,
          expired: 0,
          member: {},
          chat: 0,
          lastchat: 0,
          lastseen: 0
        }
        
        /** settings schema */
        let settings = db.data.settings[this.user.jid]
        if (typeof settings !== 'object') db.data.settings[this.user.jid] = {}
        if (settings) {
          if (!'anticall' in settings) settings.anticall = true
          if (!'grouponly' in settings) settings.grouponly = false
          if (!'autoread' in settings) settings.autoread = true
          if (!'backup' in settings) settings.backup = true
          if (!isNumber(settings.backupTime)) settings.backupTime = 0
          if (!'game' in settings) settings.game = false
          if (!'rpg' in settings) settings.rpg = false
          if (!'owners' in settings) settings.owners = ['6281252848955', '6285815700861']
          if (!'link' in settings) settings.link = 'https://chat.whatsapp.com/G57unQZ7saFIq2rdpVw0Tu'
          if (!'cover' in settings) settings.cover = 'https://iili.io/JAt7vf4.jpg'
        } else db.data.settings[this.user.jid] = {
          anticall: true,
          grouponly: false,
          autoread: true,
          backup: true,
          backupTime: 0,
          game: false,
          rpg: false,
          owners: ['6281252848955', '6285815700861'],
          link: 'https://chat.whatsapp.com/G57unQZ7saFIq2rdpVw0Tu',
          cover: 'https://iili.io/JAt7vf4.jpg'
        }
      } catch (e) {
        console.error(e)
      }

      if (opts['nyimak']) return
      if (!m.fromMe && opts['self']) return
      if (opts['pconly'] && m.chat.endsWith('g.us')) return
      if (opts['gconly'] && !m.chat.endsWith('g.us')) return
      if (opts['swonly'] && m.chat !== 'status@broadcast') return
      if (typeof m.text !== 'string') m.text = ''

      const isROwner = [global.owner, this.decodeJid(this.user.jid).split`@` [0], ...global.db.data.settings[this.user.jid].owners].map(v => v + '@s.whatsapp.net').includes(m.sender)
      const isOwner = isROwner || m.fromMe
      const isMods = isOwner
      const isPrems = db.data.users[m.sender].premium || isOwner
      const isBans = db.data.users[m.sender].banned
      const isCreated = db.data.users[m.sender].created
      
      if (opts['queque'] && m.text && !(isMods || isPrems)) {
        let queque = this.msgqueque,
        time = 1000 * 5
        const previousID = queque[queque.length - 1]
        queque.push(m.id || m.key.id)
        setInterval(async function () {
          if (queque.indexOf(previousID) === -1) clearInterval(this)
          else await delay(time)
        }, time)
      }

      if (m.isBaileys) return
      if (m.chat.endsWith('broadcast') || m.key.remoteJid.endsWith('broadcast')) return // Supaya tidak merespon di status
      let blockList = await conn.fetchBlocklist()
      if (blockList?.includes(m.sender)) return
      m.exp += Math.ceil(Math.random() * 10)
        
      let usedPrefix
      let _user = db.data && db.data.users && db.data.users[m.sender]
        
      const groupMetadata = (m.isGroup ? (conn.chats[m.chat] || {}).metadata : {}) || {}
      const participants = (m.isGroup ? groupMetadata.participants : []) || []
      const user = (m.isGroup ? participants.find(u => conn.decodeJid(u.id) === m.sender) : {}) || {} // User Data
      const bot = (m.isGroup ? participants.find(u => conn.decodeJid(u.id) == this.user.jid) : {}) || {} // Your Data
      const isRAdmin = user && user.admin == 'superadmin' || false
      const isAdmin = isRAdmin || user && user.admin == 'admin' || false // Is User Admin?
      const isBotAdmin = bot && bot.admin || false // Are you Admin?
      const users = global.db.data.users[m.sender],
        chat = global.db.data.chats[m.chat],
        setting = global.db.data.settings[this.user.jid]
        
      if (users) {
        users.lastseen = Date.now()
      }
      if (chat) {
        chat.lastseen = Date.now()
        chat.chat += 1
      }
      if (m.isGroup && !m.fromMe) {
        let now = Date.now()
        if (!chat.member[m.sender]) {
          chat.member[m.sender] = {
            lastseen: now
          }
        } else {
          chat.member[m.sender].lastseen = now
        }
      }  
        
      for (let name in global.plugins) {
        let plugin = global.plugins[name]
        if (!plugin) continue
        if (plugin.disabled) continue
        if (typeof plugin.all === 'function') {
          try {
            await plugin.all.call(this, m, chatUpdate)
          } catch (e) {
            // if (typeof e === 'string') continue
            console.error(e)
          }
        }
        
        /** restrict */
        if (!opts['restrict'])
        if (plugin.tags && plugin.tags.includes('admin')) {
          //m.reply(status.restrict)
          continue
        }

        /** autoread */
        if (setting.autoread) await this.readMessages([m.key])
        
        const str2Regex = str => str.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&')
        let _prefix = plugin.customPrefix ? plugin.customPrefix : conn.prefix ? conn.prefix : global.prefix
        let match = (_prefix instanceof RegExp ? // RegExp Mode?
          [[_prefix.exec(m.text), _prefix]] :
          Array.isArray(_prefix) ? // Array?
            _prefix.map(p => {
              let re = p instanceof RegExp ? // RegExp in Array?
                p :
                new RegExp(str2Regex(p))
              return [re.exec(m.text), re]
            }) :
            typeof _prefix === 'string' ? // String?
              [[new RegExp(str2Regex(_prefix)).exec(m.text), new RegExp(str2Regex(_prefix))]] :
              [[[], new RegExp]]
        ).find(p => p[1])
        if (typeof plugin.before === 'function')
        if (await plugin.before.call(this, m, {
          match,
          conn: this,
          participants,
          groupMetadata,
          user,
          bot,
          isROwner,
          isOwner,
          isRAdmin,
          isAdmin,
          isBotAdmin,
          users,
          chat,
          setting,
          isPrems,
          isBans,
          isCreated,
          chatUpdate
        })) continue

        if (typeof plugin !== 'function') continue
        if ((usedPrefix = (match[0] || '')[0])) {
          let noPrefix = m.text.replace(usedPrefix, '')
          let [command, ...args] = noPrefix.trim().split` `.filter(v => v)
          args = args || []
          let _args = noPrefix.trim().split` `.slice(1)
          let text = _args.join` `
          command = (command || '').toLowerCase()
          let fail = plugin.fail || global.dfail // When failed
          let isAccept = plugin.command instanceof RegExp ? // RegExp Mode?
            plugin.command.test(command) :
            Array.isArray(plugin.command) ? // Array?
            plugin.command.some(cmd => cmd instanceof RegExp ? // RegExp in Array?
              cmd.test(command) :
              cmd === command) :
            typeof plugin.command === 'string' ? // String?
            plugin.command === command :
          false
          
          if (!isAccept) continue
          users.hit += 1
          users.usebot = Date.now()
          console.log({
            hit: users.hit,
            prefix: usedPrefix.trim()
          })
          m.plugin = name
          if (m.chat in db.data.chats || m.sender in db.data.users) {
            let chat = db.data.chats[m.chat]
            let user = db.data.users[m.sender]
            if (!['owner-unbanned.js'].includes(name) && chat && chat?.isBanned && !isOwner && !isAdmin) return //Except this can be used
            if (!['owner-unbanned.js'].includes(name) && user && user?.banned) return
          }

          if (plugin.rowner && plugin.owner && !(isROwner || isOwner)) { // Both Owner
            m.reply(status.owner)
            continue
          }

          if (plugin.rowner && !isROwner) { // Real Owner
            m.reply(status.owner)
            continue
          }

          if (plugin.owner && !isOwner) { // Number Owner
            m.reply(status.owner)
            continue
          }

          if (plugin.mods && !isMods) { // Moderator
            m.reply(status.mod)
            continue
          }

          if (plugin.premium && !isPrems) { // Premium
            m.reply(status.premium)
            continue
          }

          if (plugin.group && !m.isGroup) { // Group Only
            m.reply(status.group)
            continue
          } else if (plugin.botAdmin && !isBotAdmin) { // You Admin
            m.reply(status.botAdmin)
            continue
          } else if (plugin.admin && !isAdmin) { // User Admin
            m.reply(status.admin)
            continue
          }
            
          if (plugin.private && m.isGroup) { // Private Chat Only
            m.reply(status.private)
            continue
          }
            
          if (plugin.register == true && _user.registered == false) { // Butuh daftar?
            m.reply(status.register)
            continue
          }

          if (plugin.game && db.data.settings[this.user.jid].game == false) { // game mode
            m.reply(status.game)
            continue
          }

          if (plugin.rpg && db.data.settings[this.user.jid].rpg == false) { // RPG mode
            m.reply(status.rpg)
            continue
          }

          m.isCommand = true
          let xp = 'exp' in plugin ? parseInt(plugin.exp) : 17 // XP Earning per command
          if (xp > 200) m.reply('Ngecit -_-') // Hehehe
          else m.exp += xp
          if (!isPrems && plugin.limit && db.data.users[m.sender].limit < plugin.limit * 1) {
            this.reply(m.chat, `Your limit is exhausted, please buy by sending the command *${usedPrefix}buy*`, m)
            continue // Limit habis
          }
          if (plugin.level > _user.level) {
            this.reply(m.chat, `level ${plugin.level} is required to use this feature, your current level is ${_user.level}`, m)
            continue // If the level has not been reached
          }
          let extra = {
            match,
            usedPrefix,
            noPrefix,
            _args,
            args,
            command,
            text,
            conn: this,
            participants,
            groupMetadata,
            user,
            bot,
            isROwner,
            isOwner,
            isRAdmin,
            isAdmin,
            isBotAdmin,
            users,
            chat,
            setting,
            isPrems,
            isBans,
            isCreated,
            chatUpdate
          }
          
          try {
            await plugin.call(this, m, extra)
            if (!isPrems) m.limit = m.limit || plugin.limit || false
          } catch (e) {
            //Error occured
            m.error = e
            console.error(e)
            if (e) {
              let text = util.format(e)
              for (let key of Object.values(global.APIKeys))
              text = text.replace(new RegExp(key, 'g'), '#HIDDEN#')
              if (e.name)
              for (let [jid] of global.owner) {
                let data = (await conn.onWhatsApp(jid))[0] || {}
                if (data.exists) m.reply(`*Plugin:* ${m.plugin}\n*Sender:* ${m.sender}\n*Chat:* ${m.chat}\n*Command:* ${usedPrefix}${command} ${args.join(' ')}\n\n\`\`\`${text}\`\`\``.trim(), data.jid)  
              }
              m.reply(text)  
            }
          } finally {
            // m.reply(util.format(_user))
            if (typeof plugin.after === 'function') {
              try {
                await plugin.after.call(this, m, extra)
              } catch (e) {
                console.error(e)
              }
            }
            //if (m.limit) m.reply(+ m.limit + ' Limit used')
          }
          break
        }
      }
    } catch (e) {
      console.error(e)
    } finally {
      if (opts['queque'] && m.text) {
        const quequeIndex = this.msgqueque.indexOf(m.id || m.key.id)
        if (quequeIndex !== -1) this.msgqueque.splice(quequeIndex, 1)
      }
      //console.log(db.data.users[m.sender])
      let user, stats = db.data.stats
      if (m) {
        if (m.sender && (user = db.data.users[m.sender])) {
          user.exp += m.exp
          user.limit -= m.limit * 1
        }
        let stat
        if (m.plugin) {
          let now = +new Date
          if (m.plugin in stats) {
            stat = stats[m.plugin]
            if (!isNumber(stat.total)) stat.total = 1
            if (!isNumber(stat.success)) stat.success = m.error != null ? 0 : 1
            if (!isNumber(stat.last)) stat.last = now
            if (!isNumber(stat.lastSuccess)) stat.lastSuccess = m.error != null ? 0 : now
          } else stat = stats[m.plugin] = {
            total: 1,
            success: m.error != null ? 0 : 1,
            last: now,
            lastSuccess: m.error != null ? 0 : now
          }
          stat.total += 1
          stat.last = now
          if (m.error == null) {
            stat.success += 1
            stat.lastSuccess = now
          }
        }
      }
      
      try {
        require('./lib/print')(m, this)
      } catch (e) {
        console.log(m, m.quoted, e)
      }
    }
  },
  
  async participantsUpdate({ id, participants, action }) {
    if (opts['self']) return
    // if (id in conn.chats) return // First login will spam
    if (global.isInit) return
    let chat = db.data.chats[id] || {}
    let text = ''
    switch (action) {
      case 'add':
      case 'remove':
      case 'leave':
      case 'invite':
      case 'invite_v4':
        if (chat.welcome) {
          let groupMetadata = await this.groupMetadata(id) || (conn.chats[id] || {}).metadata
          for (let user of participants) {
            let pp = './src/avatar_contact.png'
            try {
              pp = await this.profilePictureUrl(user, 'image')
            } catch (e) {
            } finally {
              text = (action === 'add' ? (chat.sWelcome || this.welcome || conn.welcome || 'Welcome, @user!').replace('@subject', await this.getName(id)).replace('@desc', groupMetadata.desc) : (chat.sBye || this.bye || conn.bye || 'Bye, @user!')).replace('@user', '@' + user.split('@')[0])
              this.sendMessageModify(id, text, null, {
                largeThumb: true,
                thumbnail: pp,
                url: setting.link,
              })
            }
          }
        }
      break

      case 'promote':
        text = (chat.sPromote || this.spromote || conn.spromote || '@user ```is now Admin```')
      case 'demote':
        if (!text) text = (chat.sDemote || this.sdemote || conn.sdemote || '@user ```is no longer Admin```')
        text = text.replace('@user', '@' + participants[0].split('@')[0])
        if (chat.detect) this.sendMessage(id, {
          text,
          mentions: this.parseMention(text)
        })
      break
    }
  },

  /**
   * anti delete 
   * @param {*} message 
   * @returns 
   */
  async delete(message) {
    try {
      const { fromMe, id, participant } = message
      if (fromMe) return
      let chats = Object.entries(conn.chats).find(([_, data]) => data.messages?.[id])
      if (!chats) return
      let msg = chats instanceof String ? JSON.parse(chats[1].messages[id]) : chats[1].messages[id]
      let chat = db.data.chats[msg.key.remoteJid] || {}
      if (chat.antidelete) return
      await this.reply(msg.key.remoteJid, `Detected @${participant.split`@`[0]} has deleted the message\n\nto disable this feature send *.enable antidelete*`.trim(), msg, {
        mentions: [participant]
      })
      this.copyNForward(msg.key.remoteJid, msg).catch(e => console.log(e, msg))
    } catch (e) {
      console.error(e)
    }
  }
},

/**
* anti call
*/
conn.ws.on('CB:call', async function callUpdatePushToDb(json) {
  let call = json.tag
  let callerId = json.attrs.from
  console.log({
    call,
    callerId
  })
  let users = db.data.users
  let user = users[callerId] || {}
  if (user.whitelist) return
  if (!db.data.settings[conn.user.jid].anticall) return
  switch (conn.callWhitelistMode) {
    case 'mycontact':
      if (callerId in conn.contacts && 'short' in conn.contacts[callerId])
      return
    break
  }
  await conn.updateBlockStatus(callerId, 'block')
  await conn.reply(global.owner + '@s.whatsapp.net', `*NOTIF CALLER BOT!*\n\n@${callerId.split`@`[0]} telah menelpon *${conn.user.name}*\n\n ${callerId.split`@`[0]}\n`, null, {
    mentions: [callerId]
  })
  Func.delay(10000) // supaya tidak spam
})

let fs = require('fs')
let chalk = require('chalk')
let file = require.resolve(__filename)
fs.watchFile(file, () => {
  fs.unwatchFile(file)
  console.log(chalk.redBright("Update 'handler.js'"))
  delete require.cache[file]
  if (global.reloadHandler) console.log(global.reloadHandler())
})