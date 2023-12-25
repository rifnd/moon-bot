let handler = async (m, {
  conn, 
  usedPrefix, 
  command, 
  args, 
  isOwner, 
  isAdmin, 
  isROwner,
  users,
  chat,
  setting
}) => {
  let isEnable = /true|enable|(turn)?on|1/i.test(command)
  let type = (args[0] || '').toLowerCase()
  let isAll = false
  let isUser = false
  switch(type) {
    
    case 'welcome':
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
    break

    case 'detect':
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
    break

    case 'antidelete':
      if (!m.isGroup) {
        if (!isOwner) {
          m.reply(status.group)
          throw false
        }
      } else if (!isAdmin) {
        m.reply(status.admin)
        throw false
      }
      chat.antidelete = isEnable
    break

    case 'public':
      isAll = true
      if (!isROwner) {
        m.reply(status.owner)
        throw false
      }
      global.opts['self'] = !isEnable
    break

    case 'antilink':
      if (m.isGroup) {
        if (!(isAdmin || isOwner)) {
          m.reply(status.admin)
          throw false
        }
      }
      chat.antilink = isEnable
    break

    case 'antivirtex':
      if (m.isGroup) {
        if (!(isAdmin || isOwner)) {
          m.reply(status.admin)
          throw false
        }
      }
      chat.antivirtex = isEnable
    break

    case 'autodownload':
      if (m.isGroup) {
        if (!isROwner) {
          m.reply(status.owner)
          throw false
        }
      }
      setting.autodownload = isEnable
    break

    case 'antisticker':
      if(m.isGroup) {
        if(!(isAdmin || isOwner)) {
          m.reply(status.admin)
          throw false
        }
      }
      chat.antisticker = isEnable
    break

    case 'autosticker':
      if(m.isGroup) {
        if(!(isAdmin || isOwner)) {
          m.reply(status.admin)
          throw false
        }
      }
      chat.autostiker = isEnable
    break

    case 'antitoxic':
      if(m.isGroup) {
        if(!(isAdmin || isOwner)) {
          m.reply(status.admin)
          throw false
        }
      }
      chat.antitoxic = !isEnable
    break

    case 'mycontact':
    case 'mycontacts':
    case 'whitelistcontact':
    case 'whitelistcontacts':
    case 'whitelistmycontact':
    case 'whitelistmycontacts':
      if(!isOwner) {
        m.reply(status.owner)
        throw false
      }
      conn.callWhitelistMode = isEnable
      break

    case 'restrict':
      isAll = true
      if(!isROwner) {
        m.reply(status.owner)
        throw false
      }
      global.opts['restrict'] = isEnable
    break

    case 'nyimak':
      isAll = true
      if(!isROwner) {
        m.reply(status.owner)
        throw false
      }
      global.opts['nyimak'] = isEnable
    break

    case 'autoread':
      isAll = true
      if(!isROwner) {
        m.reply(status.owner)
        throw false
      }
      //global.opts['autoread'] = isEnable
      setting.autoread = isEnable
    break

    case 'pconly':
    case 'privateonly':
      isAll = true
      if(!isROwner) {
        m.reply(status.owner)
        throw false
      }
      global.opts['pconly'] = isEnable
    break

    case 'gconly':
    case 'grouponly':
      isAll = true
      if(!isROwner) {
        m.reply(status.owner)
        throw false
      }
      global.opts['gconly'] = isEnable
      setting.grouponly = isEnable
    break

    case 'swonly':
    case 'statusonly':
      isAll = true
      if(!isROwner) {
        m.reply(status.owner)
        throw false
      }
      global.opts['swonly'] = isEnable
    break

    case 'game':
      isAll = true
      if(!isOwner) {
        m.reply(status.owner)
        throw false
      }
      setting.game = isEnable
      break
    case 'rpg':
      isAll = true
      if(!isOwner) {
        m.reply(status.owner)
        throw false
      }
      setting.rpg = isEnable
      break
    case 'backup':
      isAll = true
      if(!isOwner) {
        m.reply(status.owner)
        throw false
      }
      setting.backup = isEnable
      break
    case 'viewonce':
      if(m.isGroup) {
        if(!(isAdmin || isOwner)) {
          m.reply(status.admin)
          throw false
        }
      }
      chat.viewonce = isEnable
      break
    default:
      if(!/[01]/.test(command)) return m.reply(`
List option : ${isOwner ? '\n\n∘ anticall\n∘ autoread\n∘ gconly\n∘ pconly\n∘ game\n∘ rpg\n∘ backup\n∘ public' : ''}
∘ welcome
∘ antidelete 
∘ autodownload
∘ antidelete
∘ antitoxic
∘ antilink
∘ detect
∘ viewonce

Contoh :
${usedPrefix}enable welcome
${usedPrefix}disable welcome
`.trim())
      throw false
  }
  m.reply(`
*${type}* berhasil di *${isEnable ? 'nyala' : 'mati'}kan* ${isAll ? 'untuk bot ini' : isUser ? '' : 'untuk chat ini'}
`.trim())
}
handler.help = ['en', 'dis'].map(v => v + 'able')
handler.tags = ['group', 'owner']
handler.command = ['enable', 'disable', 'on', 'off']
module.exports = handler