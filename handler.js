const { smsg, Functions: Func, Scraper, Print } = new (require('@moonr/func'))
const env = require('./lib/system/config')
const fs = require('fs')
const isNumber = x => typeof x === 'number' && !isNaN(x)

module.exports = {
   async handler(chatUpdate) {
      if (db.data == null) await loadDatabase()
      conn.msgqueque = conn.msgqueque || []
      if (!chatUpdate) return
      conn.pushMessage(chatUpdate.messages).catch(console.error)
      let m = chatUpdate.messages[chatUpdate.messages.length - 1]
      if (!m) return
      if (m.message?.viewOnceMessageV2) m.message = m.message.viewOnceMessageV2.message
      if (m.message?.documentWithCaptionMessage) m.message = m.message.documentWithCaptionMessage.message
      if (m.message?.viewOnceMessageV2Extension) m.message = m.message.viewOnceMessageV2Extension.message
      try {
         m = smsg(conn, m) || m
         if (!m) return
         m.exp = 0
         m.limit = false
         require('./lib/system/schema')(m, env)
         require('./lib/system/simple')

         const users = global.db.data.users[m.sender]
         const groupSet = global.db.data.groups[m.chat]
         const chats = global.db.data.chats[m.chat]
         const setting = global.db.data.setting

         const isOwner = [env.owner, conn.decodeJid(conn.user.jid).split`@`[0], ...setting.owners].map(v => v + '@s.whatsapp.net').includes(m.sender) || m.fromMe
         const isPrems = users.premium || isOwner
         const groupMetadata = m.isGroup ? await conn.groupMetadata(m.chat) : {}
         const participants = m.isGroup ? groupMetadata ? groupMetadata.participants : [] : [] || []

         const adminList = m.isGroup ? await conn.groupAdmin(m.chat) : [] || []
         const isAdmin = m.isGroup ? adminList.includes(m.sender) : false
         const isBotAdmin = m.isGroup ? adminList.includes((conn.user.id.split`:` [0]) + '@s.whatsapp.net') : false
         const blockList = typeof await (await conn.fetchBlocklist()) != 'undefined' ? await (await conn.fetchBlocklist()) : []
         const body = typeof m.text == 'string' ? m.text : false

         if (opts['queque'] && m.text && !(isPrems)) {
            let queque = conn.msgqueque, time = 1000 * 5
            const previousID = queque[queque.length - 1]
            queque.push(m.id || m.key.id)
            setInterval(async function () {
               if (queque.indexOf(previousID) === -1) clearInterval(conn)
               else await delay(time)
            }, time)
         }

         if (m.isBaileys) return
         if (m.chat.endsWith('broadcast') || m.key.remoteJid.endsWith('broadcast')) return
         m.exp += Math.ceil(Math.random() * 10)
         let usedPrefix
         if (typeof m.text !== 'string') m.text = ''

         if (!setting.online) conn.sendPresenceUpdate('unavailable', m.chat)
         if (setting.online) {
            conn.sendPresenceUpdate('available', m.chat)
            conn.readMessages([m.key])
         }
         if (!users || typeof users.limit === undefined) return global.db.data.users = {
            jid: m.sender,
            banned: false,
            limit: env.limit,
            hit: 0,
            spam: 0
         }
         if (setting.debug && !m.fromMe && isOwner) conn.reply(m.chat, Func.jsonFormat(m), m)
         if (m.isGroup && !groupSet.stay && (new Date * 1) >= groupSet.expired && groupSet.expired != 0) {
            return conn.reply(m.chat, Func.texted('italic', '🚩 Bot time has expired and will leave from this group, thank you.', null, {
               mentions: participants.map(v => v.id)
            })).then(async () => {
               groupSet.expired = 0
               await Func.delay(2000).then(() => conn.groupLeave(m.chat))
            })
         }
         if (users && (new Date * 1) >= users.expired && users.expired != 0) {
            return conn.reply(users.jid, Func.texted('italic', '🚩 Your premium package has expired, thank you for buying and using our service.')).then(async () => {
               users.premium = false
               users.expired = 0
               users.limit = env.limit
            })
         }
         if (m.isGroup) groupSet.activity = new Date() * 1
         if (users) {
            users.name = m.name
            users.lastseen = new Date() * 1
         }
         if (chats) {
            chats.chat += 1
            chats.lastseen = new Date * 1
         }
         if (m.isGroup && !m.isBaileys && users && users.afk > -1) {
            conn.reply(m.chat, `You are back online after being offline for : ${Func.texted('bold', Func.toTime(new Date - users.afk))}\n\n• ${Func.texted('bold', 'Reason')}: ${users.afkReason ? users.afkReason : '-'}`, m)
            users.afk = -1
            users.afkReason = ''
         }
         if (m.isGroup && !m.fromMe) {
            let now = new Date() * 1
            if (!groupSet.member[m.sender]) {
               groupSet.member[m.sender] = {
                  lastseen: now,
                  warning: 0
               }
            } else {
               groupSet.member[m.sender].lastseen = now
            }
         }

         for (let name in global.plugins) {
            //let plugin = global.plugins[name]
            let plugin
            if (typeof plugins[name].run === 'function') {
               let ai = plugins[name]
               plugin = ai.run;
               for (let prop in ai) {
                  if (prop !== 'run') {
                     plugin[prop] = ai[prop];
                  }
               }
            } else {
               plugin = plugins[name]
            }

            if (!plugin) continue
            if (plugin.disabled) continue
            if (typeof plugin.all === 'function') {
               try {
                  await plugin.all.call(this, m, chatUpdate)
               } catch (e) {
                  console.error(e)
               }
            }

            /*if (opts['restrict']) if (plugin.tags && plugin.tags.includes('admin')) {
              global.dfail('restrict', m, conn)
              continue
            }*/

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
            if (typeof plugin.before === 'function') if (await plugin.before.call(this, m, {
               match,
               body,
               blockList,
               conn: conn,
               participants,
               groupMetadata,
               isOwner,
               isAdmin,
               isBotAdmin,
               isPrems,
               users,
               groupSet,
               chats,
               setting,
               chatUpdate,
               Func,
               Scraper,
               env
            })) continue

            if (typeof plugin !== 'function') continue
            if ((usedPrefix = (match[0] || '')[0])) {
               let noPrefix = m.text.replace(usedPrefix, '')
               let [command, ...args] = noPrefix.trim().split` `.filter(v => v)
               args = args || []
               let _args = noPrefix.trim().split` `.slice(1)
               let text = _args.join` `
               command = (command || '').toLowerCase()
               let fail = plugin.fail || global.status // When failed
               let isAccept = plugin.command instanceof RegExp ? // RegExp Mode?
                  plugin.command.test(command) :
                  Array.isArray(plugin.command) ? // Array?
                     plugin.command.some(cmd => cmd instanceof RegExp ? // RegExp in Array?
                        cmd.test(command) :
                        cmd === command
                     ) :
                     typeof plugin.command === 'string' ? // String?
                        plugin.command === command :
                        false

               if (!isAccept) continue

               users.hit += 1
               users.usebot = Date.now()
               console.log({ hit: users.hit, prefix: usedPrefix.trim(), command: command })

               m.plugin = name
               if (m.chat in db.data.groups || m.sender in db.data.users) {
                  if (name != 'owner-unbanned.js' && groupSet && groupSet.isBanned) return // Except conn
                  if (name != 'owner-unbanned.js' && users && users.banned) return
               }

               if (m.isBaileys || m.chat.endsWith('broadcast') || /edit/.test(m.mtype)) continue
               if (setting.self && !isOwner && !m.fromMe) continue
               if (setting.privatemode && !isOwner && !m.fromMe && m.isGroup) continue
               if (!m.isGroup && !['miscs-owner.js'].includes(name.split('/').pop()) && chats && !isPrems && !users.banned && new Date() * 1 - chats.lastchat < env.timeout) continue
               if (!m.isGroup && !['miscs-owner.js'].includes(name) && chats && !isPrems && !users.banned && setting.groupmode) {
                  conn.sendMessageModify(m.chat, `⚠️ Using bot in private chat only for premium user, want to upgrade to premium plan ? send *${usedPrefix}premium* to see benefit and prices.`, m, {
                     largeThumb: true,
                     thumbnail: 'https://telegra.ph/file/0b32e0a0bb3b81fef9838.jpg',
                     url: setting.link
                  }).then(() => chats.lastchat = new Date() * 1)
                  continue
               }

               if (plugin.owner && !isOwner) { // Number Owner
                  m.reply(global.status.owner)
                  continue
               }
               if (plugin.premium && !isPrems) { // Premium
                  const soad = [{
                     name: 'quick_reply',
                     buttonParamsJson: JSON.stringify({
                        display_text: 'Contact Owner',
                        id: `${usedPrefix}owner`
                     })
                  }]
                  conn.sendAIMessage(m.chat, soad, m, {
                     content: global.status.premium,
                     footer: global.set.footer,
                  })
                  //m.reply(global.status.premium)
                  continue
               }
               if (plugin.group && !m.isGroup) { // Group Only
                  m.reply(global.status.group)
                  continue
               } else if (plugin.botAdmin && !isBotAdmin) { // You Admin
                  m.reply(global.status.botAdmin)
                  continue
               } else if (plugin.admin && !isAdmin) { // User Admin
                  m.reply(global.status.admin)
                  continue
               }
               if (plugin.private && m.isGroup) { // Private Chat Only
                  m.reply(global.status.private)
                  continue
               }
               if (plugin.register == true && users.registered == false) { // Butuh daftar?
                  m.reply(global.status.register)
                  continue
               }
               if (plugin.game && setting.game == false) {
                  // game mode
                  m.reply(status.game)
                  continue
               }
               if (plugin.rpg && setting.rpg == false) {
                  // RPG mode
                  m.reply(status.rpg)
                  continue
               }

               m.isCommand = true
               let xp = 'exp' in plugin ? parseInt(plugin.exp) : 17 // XP Earning per command
               if (xp > 200) m.reply('Ngecit -_-') // Hehehe
               else m.exp += xp
               if (!isPrems && plugin.limit && users.limit < plugin.limit * 1) {
                  const soad = [{
                     name: 'quick_reply',
                     buttonParamsJson: JSON.stringify({
                        display_text: 'Buy',
                        id: `${usedPrefix}buy 1`
                     })
                  }]
                  conn.sendAIMessage(m.chat, soad, m, {
                     content: `Your limit is exhausted, please purchase via *${usedPrefix}buy*`,
                     footer: global.footer,
                  })
                  //conn.reply(m.chat, `Your limit is exhausted, please purchase via *${usedPrefix}buy*`, m)
                  continue // Limit habis
               }
               if (plugin.level > users.level) {
                  conn.reply(m.chat, `level ${plugin.level} is required to use conn command. Your level ${users.level}`, m)
                  continue // If the level has not been reached
               }
               let extra = {
                  match,
                  body,
                  blockList,
                  usedPrefix,
                  noPrefix,
                  _args,
                  args,
                  command,
                  text,
                  conn: conn,
                  participants,
                  groupMetadata,
                  isOwner,
                  isAdmin,
                  isBotAdmin,
                  isPrems,
                  users,
                  groupSet,
                  chats,
                  setting,
                  chatUpdate,
                  Func,
                  Scraper,
                  env
               }
               try {
                  await plugin.call(conn, m, extra)
                  if (!isPrems) m.limit = m.limit || plugin.limit || false
               } catch (e) {
                  m.error = e
                  console.error(e)
                  if (e) {
                     let text = Func.jsonFormat(e)
                     conn.reply(env.owner + '@s.whatsapp.net', `*Plugin:* ${m.plugin}\n*Sender:* ${m.sender}\n*Chat:* ${m.chat}\n*Command:* ${usedPrefix}${command} ${args.join(' ')}\n\n\`\`\`${text}\`\`\``.trim(), m)
                     m.reply(text)
                  }
               } finally {
                  if (typeof plugin.after === 'function') {
                     try {
                        await plugin.after.call(conn, m, extra)
                     } catch (e) {
                        console.error(e)
                     }
                  }
               }
               break
            }
         }
      } catch (e) {
         console.error(e)
      } finally {
         if (opts['queque'] && m.text) {
            const quequeIndex = conn.msgqueque.indexOf(m.id || m.key.id)
            if (quequeIndex !== -1) conn.msgqueque.splice(quequeIndex, 1)
         }
         let user, stats = db.data.stats
         if (m) {
            if (m.sender && (user = db.data.users[m.sender])) {
               user.exp += m.exp
               user.limit -= m.limit * 1
            }

            let stat
            if (m.plugin) {
               let now = + new Date
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
            Print(m, conn)
         } catch (e) {
            console.log(m, m.quoted, e)
         }
      }
   },
   async participantsUpdate({ id, participants, action }) {
      if (global.db.data.setting.self) return
      if (global.isInit) return
      let group = global.db.data.groups[id] || {}
      let text = ''
      switch (action) {
         case 'add':
         case 'remove':
         case 'leave':
         case 'invite':
         case 'invite_v4':
            if (group.welcome) {
               let groupMetadata = await conn.groupMetadata(id) || (conn.chats[id] || {}).metadata
               for (let user of participants) {
                  let pp = './src/image/default.png'
                  try {
                     pp = await conn.profilePictureUrl(user, 'image')
                  } catch (e) {
                  } finally {
                     text = (action === 'add' ? (group.sWelcome || conn.welcome || conn.welcome || 'Welcome, @user!').replace('@subject', await conn.getName(id)).replace('@desc', groupMetadata.desc.toString()) :
                        (group.sBye || conn.bye || conn.bye || 'Bye, @user!')).replace('@user', '@' + user.split('@')[0])
                     conn.sendMessageModify(id, text, null, {
                        largeThumb: true,
                        thumbnail: pp,
                        url: global.db.data.setting.link
                     })
                  }
               }
            }
         break
         case 'promote':
            text = (group.sPromote || conn.spromote || conn.spromote || '@user ```is now Admin```')
         case 'demote':
            if (!text) text = (group.sDemote || conn.sdemote || conn.sdemote || '@user ```is no longer Admin```')
            text = text.replace('@user', '@' + participants[0].split('@')[0])
            if (group.detect) conn.sendMessage(id, { text, mentions: conn.parseMention(text) })
         break
      }
   },
   async delete({ fromMe, id, participant }) {
      try {
         if (fromMe) return
         let chats = Object.entries(conn.chats).find(([_, data]) => data.messages?.[id])
         if (!chats) return
         let msg = chats instanceof String ? JSON.parse(chats[1].messages[id]) : chats[1].messages[id]
         let group = global.db.data.groups[msg.key.remoteJid] || {}
         if (!group.antidelete) return
         await conn.reply(msg.key.remoteJid, `detected @${participant.split`@`[0]} has deleted the message
To turn off this feature, send
*.off antidelete*
`.trim(), msg, {
            mentions: [participant]
         })
         conn.copyNForward(msg.key.remoteJid, msg).catch(e => console.log(e, msg))
      } catch (e) {
         console.error(e)
      }
   }
}
conn.ws.on('CB:call', async function callUpdatePushToDb(json) {
   let call = json.tag
   let callerId = json.attrs.from
   console.log({ call, callerId })
   let users = db.data.users
   let user = users[callerId] || {}
   if (!db.data.setting.anticall) return
   await conn.reply(global.owner + '@s.whatsapp.net', `*NOTIF CALLER BOT!*\n\n@${callerId.split`@`[0]} telah menelpon *${conn.user.name}*\n\n ${callerId.split`@`[0]}\n`, null, { mentions: [callerId] })
   Func.delay(10000) // supaya tidak spam
})

let file = require.resolve(__filename)
fs.watchFile(file, () => {
   fs.unwatchFile(file)
   Func.logFile('UPDATE : handler.js')
   delete require.cache[file]
   if (global.reloadHandler) console.log(global.reloadHandler())
})