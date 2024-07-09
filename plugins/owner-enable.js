let handler = async (m, {
   usedPrefix,
   command,
   args,
   isOwner,
   isAdmin,
   isROwner,
   chat,
   setting
}) => {
   let isEnable = /true|enable|(turn)?on|1/i.test(command)
   let type = (args[0] || '').toLowerCase()
   let isAll = false
   let isUser = false
   let c = ['welcome', 'detect', 'delete', 'antilink', 'antisticker', 'autosticker', 'antiviewonce', 'antitoxic']
   let s = ['self', 'anticall', 'autoread', 'pconly', 'grouponly', 'backup', 'game', 'rpg']
   switch (type) {
      /** chats */
      case 'welcome': {
         if (!m.isGroup) {
            if (!isOwner) {
               m.reply(status.group)
               throw false
            }
         } else if (!isAdmin) {
            m.reply(status.admin)
            throw false
         }
         chat.welcome = isEnable
      }
      break
      case 'detect': {
         if (!m.isGroup) {
            if (!isOwner) {
               m.reply(status.group)
               throw false
            }
         } else if (!isAdmin) {
            m.reply(status.admin)
            throw false
         }
         chat.detect = isEnable
      }
      break
      case 'delete': {
         if (!m.isGroup) {
            if (!isOwner) {
               m.reply(status.group)
               throw false
            }
         } else if (!isAdmin) {
            m.reply(status.admin)
            throw false
         }
         chat.delete = isEnable
      }
      break
      case 'antilink': {
         if (m.isGroup) {
            if (!(isAdmin || isOwner)) {
               m.reply(status.admin)
               throw false
            }
         }
         chat.antilink = isEnable
      }
      break
      case 'antisticker': {
         if (m.isGroup) {
            if (!(isAdmin || isOwner)) {
               m.reply(status.admin)
               throw false
            }
         }
         chat.antisticker = isEnable
      }
      break
      case 'autosticker': {
         if (m.isGroup) {
            if (!(isAdmin || isOwner)) {
               m.reply(status.admin)
               throw false
            }
         }
         chat.autosticker = isEnable
      }
      break
      case 'antiviewonce': {
         if (m.isGroup) {
            if (!(isAdmin || isOwner)) {
               m.reply(status.admin)
               throw false
            }
         }
         chat.antiviewonce = isEnable
      }
      break
      case 'antitoxic': {
         if (m.isGroup) {
            if (!(isAdmin || isOwner)) {
               m.reply(status.admin)
               throw false
            }
         }
         chat.antitoxic = !isEnable
      }
      break

      /** settings */
      case 'self': {
         isAll = true
         if (!isROwner) {
            m.reply(status.owner)
            throw false
         }
         setting.self = isEnable
      }
      break
      case 'autoread': {
         isAll = true
         if (!isROwner) {
            m.reply(status.owner)
            throw false
         }
         setting.autoread = isEnable
      }
      break
      case 'pconly': {
         isAll = true
         if (!isROwner) {
            m.reply(status.owner)
            throw false
         }
         setting.pconly = isEnable
      }
      break
      case 'grouponly':
      case 'gconly': {
         isAll = true
         if (!isROwner) {
            m.reply(status.owner)
            throw false
         }
         setting.grouponly = isEnable
      }
      break
      case 'game': {
         isAll = true
         if (!isOwner) {
            m.reply(status.owner)
            throw false
         }
         setting.game = isEnable
      }
      break
      case 'rpg': {
         isAll = true
         if (!isOwner) {
            m.reply(status.owner)
            throw false
         }
         setting.rpg = isEnable
      }
      break
      case 'backup': {
         isAll = true
         if (!isOwner) {
            m.reply(status.owner)
            throw false
         }
         setting.backup = isEnable
      }
      break

      default:
      var opt = `–  *O P T I O N*\n${isOwner ? '\n' + s.map(v => '  ◦  ' + v).join`\n` : ''}${m.isGroup ? '\n' + c.map(v => '  ◦  ' + v).join`\n` : ''}\n\n${global.set.footer}`
      if (!/[01]/.test(command)) return conn.reply(m.chat, opt, m)
   }
   m.reply(`*${type}* successfully *${isEnable ? 'enabled' : 'disabled'}* ${isAll ? 'for this bot' : isUser ? '' : 'for this chat'}
`.trim())
}
handler.help = ['en', 'dis'].map(v => v + 'able')
handler.tags = ['group', 'owner']
handler.command = ['enable', 'disable', 'on', 'off']
module.exports = handler