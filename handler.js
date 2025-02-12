const { Functions: Func, Scraper, Print, Queque, Config: env } = new (require('@moonr/utils'))
const cron = require('node-cron')

module.exports = async (conn, ctx, database) => {
   var { m, chatUpdate, store, match, body, command, args, _args, text, plugins, prefix, usedPrefix, prefixes } = ctx
   try {
      conn.msgqueque = conn.msgqueque || new Queque()
      require('./lib/system/schema')(m, env)
      const users = global.db.users[m.sender]
      const groupSet = global.db.groups[m.chat]
      const chats = global.db.chats[m.chat]
      const setting = global.db.setting
      const isOwner = [conn.decodeJid(conn.user.id).replace(/@.+/, ''), env.owner, ...setting.owners].map(v => v + '@s.whatsapp.net').includes(m.sender)
      const isPrems = users.premium || isOwner
      const groupMetadata = m.isGroup ? await conn.groupMetadata(m.chat) : {}
      const participants = m.isGroup ? groupMetadata ? groupMetadata.participants : [] : [] || []
      const adminList = m.isGroup ? await conn.groupAdmin(m.chat) : [] || []
      const isAdmin = m.isGroup ? adminList.includes(m.sender) : false
      const isBotAdmin = m.isGroup ? adminList.includes((conn.user.id.split`:`[0]) + '@s.whatsapp.net') : false
      const blockList = typeof await (await conn.fetchBlocklist()) != 'undefined' ? await (await conn.fetchBlocklist()) : []
      /** Queque */
      if (process.argv.includes('--queque') && m.text && !m.fromMe && !(isPrems)) {
         const id = m.id
         conn.msgqueque.add(id)
         await conn.msgqueque.waitQueue(id)
      }
      if (!setting.online) conn.sendPresenceUpdate('unavailable', m.chat)
      if (setting.online) {
         conn.sendPresenceUpdate('available', m.chat)
         conn.readMessages([m.key])
      }
      if (!users || typeof users.limit === undefined) return global.db.users = {
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
         return conn.reply(m.chat, Func.texted('italic', '🚩 Your premium package has expired, thank you for buying and using our service.')).then(async () => {
            users.premium = false
            users.expired = 0
            users.limit = env.limit
         })
      }
      if (m.isGroup) groupSet.activity = new Date() * 1
      if (users) {
         users.name = m.name
         users.lastseen = new Date() * 1
         users.role = Func.role(users.level).name
      }
      if (chats) {
         chats.chat += 1
         chats.lastseen = new Date * 1
      }
      if (m.isGroup && !m.isBot && users && users.afk > -1) {
         conn.reply(m.chat, `You are back online after being offline for : ${Func.texted('bold', Func.toTime(new Date - users.afk))}\n\n• ${Func.texted('bold', 'Reason')}: ${users.afkReason ? users.afkReason : '-'}`, m)
         users.afk = -1
         users.afkReason = ''
      }
      cron.schedule('00 00 * * *', () => {
         setting.lastReset = Date.now()
         Object.values(global.db.users).forEach(v => { if (v.limit < env.limit && !v.premium) { v.limit = env.limit } })
         Object.values(global.db.stats).forEach(prop => prop.today = 0)
      }, {
         scheduled: true,
         timezone: process.env.TZ
      })
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
      for (let name in plugins) {
         let plugin
         if (typeof plugins[name].run === 'function') {
            let ai = plugins[name]
            plugin = ai.run
            for (let prop in ai) {
               if (prop !== 'run') {
                  plugin[prop] = ai[prop]
               }
            }
         } else {
            plugin = plugins[name]
         }
         if (!plugin) continue
         if (typeof plugin.all === 'function') {
            try {
               await plugin.all.call(conn, m, chatUpdate)
            } catch (e) {
               console.error(e)
            }
         }
         if (typeof plugin.before === 'function') if (m.fromMe || m.isBot || m.chat.endsWith('broadcast') || await plugin.before.call(this, m, { match, body, blockList, conn: conn, store, database, prefixes, plugins, participants, groupMetadata, isOwner, isAdmin, isBotAdmin, isPrems, users, groupSet, chats, setting, chatUpdate, Func, Scraper, env })) continue
         if (typeof plugin !== 'function') continue

         if (match || setting.noprefix) {
            let isAccept = ((Array.isArray(plugin.command) && plugin.command.includes(command)) || (Array.isArray(plugin.help) && plugin.help.includes(command)))
            if (!isAccept) continue
            m.plugin = name
            m.isCommand = true
            users.hit += 1
            users.usebot = Date.now()

            if (setting.error.includes(command)) return m.reply(Func.texted('bold', `🚩 Command _${usedPrefix + command}_ disabled.`))
            if (plugin.disabled || setting.pluginDisable.includes(name.split('/').pop())) return
            if (!m.isGroup && env.blocks.some(no => m.sender.startsWith(no))) return conn.updateBlockStatus(m.sender, 'block')
            if ((m.fromMe && m.isBot) || /broadcast|newsletter/.test(m.chat) || /edit/.test(m.mtype)) continue
            if (setting.self && !isOwner && !m.fromMe) continue
            if (setting.privatemode && !isOwner && !m.fromMe && m.isGroup) continue
            if (!m.isGroup && !['owner.js', 'price.js', 'reg.js', 'menfess.js', 'menfess_ev.js'].includes(name.split('/').pop()) && chats && !isPrems && !users.banned && new Date() * 1 - chats.lastchat < env.timeout) continue
            if (!m.isGroup && !['owner.js', 'price.js', 'reg.js', 'menfess.js', 'menfess_ev.js'].includes(name.split('/').pop()) && chats && !isPrems && !users.banned && setting.groupmode) {
               conn.sendMessageModify(m.chat, `⚠️ Using bot in private chat only for premium user, want to upgrade to premium plan ? send *${usedPrefix}premium* to see benefit and prices.`, m, {
                  largeThumb: true,
                  thumbnail: 'https://telegra.ph/file/0b32e0a0bb3b81fef9838.jpg',
                  url: setting.link
               }).then(() => chats.lastchat = new Date() * 1)
               continue
            }
            if (!['me.js'].includes(name.split('/').pop()) && users && (users.banned || new Date - users.ban_temporary < env.timeout)) continue
            if (m.isGroup && !['unbanned.js', 'groupinfo.js'].includes(name.split('/').pop()) && groupSet.isBanned) continue

            if (plugin.owner && !isOwner) {
               m.reply(global.status.owner)
               continue
            } else if (plugin.premium && !isPrems) {
               m.reply(global.status.premium)
               continue
            } else if (plugin.group && !m.isGroup) {
               m.reply(global.status.group)
               continue
            } else if (plugin.botAdmin && !isBotAdmin) {
               m.reply(global.status.botAdmin)
               continue
            } else if (plugin.admin && !isAdmin) {
               m.reply(global.status.admin)
               continue
            } else if (plugin.private && m.isGroup) {
               m.reply(global.status.private)
               continue
            } else if (plugin.error) {
               m.reply(global.status.errorF)
               continue
            } else if (plugin.register && !users.registered) {
               m.reply(global.status.register)
               continue
            } else if (plugin.game && !setting.game) {
               m.reply(global.status.game)
               continue
            } else if (plugin.limit && users.limit < plugin.limit * 1) {
               conn.reply(m.chat, `⚠️ You reached the limit and will be reset at 00.00\n\nTo get more limits upgrade to premium plans.`, m).then(() => users.premium = false)
               continue
            } else if (plugin.limit && users.limit > 0) {
               const limit = plugin.limit == 'Boolean' ? 1 : plugin.limit
               if (users.limit >= limit) {
                  users.limit -= limit
               } else {
                  conn.reply(m.chat, Func.texted('bold', `⚠️ Your limit is not enough to use this feature.`), m)
                  continue
               }
            } else if (plugin.level > users.level) {
               conn.reply(m.chat, `⚠️ level *${plugin.level}* is required to use conn command. Your level *${users.level}*`, m)
               continue
            }
            let extra = { match, body, blockList, usedPrefix, _args, args, command, text, conn: conn, store, database, plugins, participants, groupMetadata, isOwner, isAdmin, isBotAdmin, isPrems, users, groupSet, chats, setting, chatUpdate, Func, Scraper, env }
            try {
               await plugin.call(conn, m, extra)
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
      let stats = (global.db && global.db.stats) || {}
      if (m) {
         if (m.plugin) {
            let now = +new Date()
            let pluginName = m.plugin.split('/').pop().replace('.js', '')
            let stat = stats[pluginName] || { hitstat: 0, today: 0, lasthit: 0 }
            stat.hitstat += 1
            stat.today += 1
            stat.lasthit = now
            stats[pluginName] = stat
         }
      }
      try {
         Print(m, conn)
      } catch (e) {
         console.log(m, m.quoted, e)
      }
   }
   Func.updateFile(require.resolve(__filename))
}