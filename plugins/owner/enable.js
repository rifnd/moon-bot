module.exports = {
   help: ['en', 'dis'].map(v => v + 'able'),
   use: 'option',
   tags: ['admin', 'owner'],
   command: /^(on|off|enable|disable)$/i,
   run: async (m, {
      conn,
      usedPrefix,
      command,
      args,
      isAdmin,
      isBotAdmin,
      isOwner,
      groupSet,
      setting
   }) => {
      var isEnable = /true|enable|(turn)?on|1/i.test(command)
      var type = (args[0] || '').toLowerCase()
      var isAll = false
      var isUser = false
      var g = ['welcome', 'detect', 'antidelete', 'antilink', 'antivirtex', 'autosticker', 'antisticker', 'viewonce', 'filter']
      var o = ['anticall', 'chatbot', 'levelup', 'self', 'online', 'antispam', 'debug', 'autodownload', 'groupmode', 'privatemode', 'game', 'rpg', 'noprefix']
      switch (type) {
         /** group setting */
         case 'welcome': {
            if (!m.isGroup) {
               if (!isOwner) {
                  conn.reply(m.chat, global.status.owner, m)
                  throw false
               }
            } else if (!isAdmin) {
               conn.reply(m.chat, global.status.admin, m)
               throw false
            }
            groupSet.welcome = isEnable
         }
         break
         case 'detect': {
            if (!m.isGroup) {
               if (!isOwner) {
                  conn.reply(m.chat, global.status.owner, m)
                  throw false
               }
            } else if (!isAdmin) {
               conn.reply(m.chat, global.status.admin, m)
               throw false
            }
            groupSet.detect = isEnable
         }
         break
         case 'antidelete': {
            if (!m.isGroup) {
               if (!isOwner) {
                  conn.reply(m.chat, global.status.owner, m)
                  throw false
               }
            } else if (!isAdmin) {
               conn.reply(m.chat, global.status.admin, m)
               throw false
            }
            groupSet.antidelete = isEnable
         }
         break
         case 'antilink': {
            if (!m.isGroup) {
               if (!isOwner) {
                  conn.reply(m.chat, global.status.owner, m)
                  throw false
               }
            } else if (!isAdmin) {
               conn.reply(m.chat, global.status.admin, m)
               throw false
            }
            groupSet.antilink = isEnable
         }
         break
         case 'antivirtex': {
            if (!m.isGroup) {
               if (!isOwner) {
                  conn.reply(m.chat, global.status.owner, m)
                  throw false
               }
            } else if (!isAdmin) {
               conn.reply(m.chat, global.status.admin, m)
               throw false
            }
            groupSet.antivirtex = isEnable
         }
         break
         case 'autosticker': {
            if (!m.isGroup) {
               if (!isOwner) {
                  conn.reply(m.chat, global.status.owner, m)
                  throw false
               }
            } else if (!isAdmin) {
               conn.reply(m.chat, global.status.admin, m)
               throw false
            }
            groupSet.autosticker = isEnable
         }
         break
         case 'antisticker': {
            if (!m.isGroup) {
               if (!isOwner) {
                  conn.reply(m.chat, global.status.owner, m)
                  throw false
               }
            } else if (!isAdmin) {
               conn.reply(m.chat, global.status.admin, m)
               throw false
            }
            groupSet.antisticker = isEnable
         }
         break
         case 'viewonce': {
            if (!m.isGroup) {
               if (!isOwner) {
                  conn.reply(m.chat, global.status.owner, m)
                  throw false
               }
            } else if (!isAdmin) {
               conn.reply(m.chat, global.status.admin, m)
               throw false
            }
            groupSet.viewonce = isEnable
         }
         break
         case 'filter': {
            if (!m.isGroup) {
               if (!isOwner) {
                  conn.reply(m.chat, global.status.owner, m)
                  throw false
               }
            } else if (!isAdmin) {
               conn.reply(m.chat, global.status.admin, m)
               throw false
            }
            groupSet.filter = isEnable
         }
         break

         /** bot setting */
         case 'anticall': {
            isAll = true
            if (!isOwner) {
               conn.reply(m.chat, global.status.owner, m)
               throw false
            }
            setting.anticall = isEnable
         }
         break
         case 'chatbot': {
            isAll = true
            if (!isOwner) {
               conn.reply(m.chat, global.status.owner, m)
               throw false
            }
            setting.chatbot = isEnable
         }
         break
         case 'levelup': {
            isAll = true
            if (!isOwner) {
               conn.reply(m.chat, global.status.owner, m)
               throw false
            }
            setting.levelup = isEnable
         }
         break
         case 'self': {
            isAll = true
            if (!isOwner) {
               conn.reply(m.chat, global.status.owner, m)
               throw false
            }
            setting.self = isEnable
         }
         break
         case 'online': {
            isAll = true
            if (!isOwner) {
               conn.reply(m.chat, global.status.owner, m)
               throw false
            }
            setting.online = isEnable
         }
         break
         case 'antispam': {
            isAll = true
            if (!isOwner) {
               conn.reply(m.chat, global.status.owner, m)
               throw false
            }
            setting.antispam = isEnable
         }
         break
         case 'debug': {
            isAll = true
            if (!isOwner) {
               conn.reply(m.chat, global.status.owner, m)
               throw false
            }
            setting.debug = isEnable
         }
         break
         case 'autodownload': {
            isAll = true
            if (!isOwner) {
               conn.reply(m.chat, global.status.owner, m)
               throw false
            }
            setting.autodownload = isEnable
         }
         break
         case 'groupmode': {
            isAll = true
            if (!isOwner) {
               conn.reply(m.chat, global.status.owner, m)
               throw false
            }
            setting.groupmode = isEnable
         }
         break
         case 'privatemode': {
            isAll = true
            if (!isOwner) {
               conn.reply(m.chat, global.status.owner, m)
               throw false
            }
            setting.privatemode = isEnable
         }
         break
         case 'game': {
            isAll = true
            if (!isOwner) {
               conn.reply(m.chat, global.status.owner, m)
               throw false
            }
            setting.game = isEnable
         }
         break
         case 'rpg': {
            isAll = true
            if (!isOwner) {
               conn.reply(m.chat, global.status.owner, m)
               throw false
            }
            setting.rpg = isEnable
         }
         break
         case 'noprefix': {
            isAll = true
            if (!isOwner) {
               conn.reply(m.chat, global.status.owner, m)
               throw false
            }
            setting.noprefix = isEnable
         }
         break
         default:
            var opt = `乂  *O P T I O N*\n${isOwner ? '\n' + o.map(v => '  ◦  ' + v).join`\n` : ''}${m.isGroup ? '\n' + g.map(v => '  ◦  ' + v).join`\n` : ''}\n\n${global.footer}`
            if (!/[01]/.test(command)) return conn.reply(m.chat, opt, m)
      }
      conn.reply(m.chat, `*${type}* successfully *${isEnable ? 'enable' : 'disable'}* ${isAll ? 'for this bot' : isUser ? '' : 'for this group'}`.trim(), m)
   }
}