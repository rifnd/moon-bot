let handler = async (m, { conn, usedPrefix, command, args, isOwner, isAdmin, isROwner }) => {
  let isEnable = /true|enable|(turn)?on|1/i.test(command)
  let chat = global.db.data.chats[m.chat]
  let user = global.db.data.users[m.sender]
  let settings = global.db.data.settings[conn.user.jid]
  let type = (args[0] || '').toLowerCase()
  let isAll = false
  let isUser = false
  switch(type) {
    case 'welcome':
      if(!m.isGroup) {
        if(!isOwner) {
          global.dfail('group', m, conn)
          throw false
        }
      } else if(!isAdmin) {
        global.dfail('admin', m, conn)
        throw false
      }
      chat.welcome = isEnable
      break
    case 'detect':
      if(!m.isGroup) {
        if(!isOwner) {
          global.dfail('group', m, conn)
          throw false
        }
      } else if(!isAdmin) {
        global.dfail('admin', m, conn)
        throw false
      }
      chat.detect = isEnable
      break
    case 'delete':
      if(m.isGroup) {
        if(!(isAdmin || isOwner)) {
          global.dfail('admin', m, conn)
          throw false
        }
      }
      chat.delete = isEnable
      break
    case 'antidelete':
      if(m.isGroup) {
        if(!(isAdmin || isOwner)) {
          global.dfail('admin', m, conn)
          throw false
        }
      }
      chat.delete = !isEnable
      break
    case 'autodelvn':
      if(m.isGroup) {
        if(!(isAdmin || isOwner)) {
          global.dfail('admin', m, conn)
          throw false
        }
      }
      chat.autodelvn = isEnable
      break
    case 'document':
      chat.useDocument = isEnable
      break
    case 'public':
      isAll = true
      if(!isROwner) {
        global.dfail('rowner', m, conn)
        throw false
      }
      global.opts['self'] = !isEnable
      break
    case 'antilink':
      if(m.isGroup) {
        if(!(isAdmin || isOwner)) {
          global.dfail('admin', m, conn)
          throw false
        }
      }
      chat.antiLink = isEnable
      break
    case 'antivirtex':
      if(m.isGroup) {
        if(!(isAdmin || isOwner)) {
          global.dfail('admin', m, conn)
          throw false
        }
      }
      chat.antivirtex = isEnable
      break
    case 'autodownload':
    case 'download':
      if(m.isGroup) {
        if(!(isAdmin || isOwner)) {
          global.dfail('admin', m, conn)
          throw false
        }
      }
      chat.download = isEnable
      break
    case 'antisticker':
      if(m.isGroup) {
        if(!(isAdmin || isOwner)) {
          global.dfail('admin', m, conn)
          throw false
        }
      }
      chat.antiSticker = isEnable
      break
    case 'autosticker':
      if(m.isGroup) {
        if(!(isAdmin || isOwner)) {
          global.dfail('admin', m, conn)
          throw false
        }
      }
      chat.stiker = isEnable
      break
    case 'toxic':
      if(m.isGroup) {
        if(!(isAdmin || isOwner)) {
          global.dfail('admin', m, conn)
          throw false
        }
      }
      chat.antiToxic = !isEnable
      break
    case 'antitoxic':
      if(m.isGroup) {
        if(!(isAdmin || isOwner)) {
          global.dfail('admin', m, conn)
          throw false
        }
      }
      chat.antiToxic = isEnable
      break
    case 'autolevelup':
      isUser = true
      user.autolevelup = isEnable
      break
    case 'mycontact':
    case 'mycontacts':
    case 'whitelistcontact':
    case 'whitelistcontacts':
    case 'whitelistmycontact':
    case 'whitelistmycontacts':
      if(!isOwner) {
        global.dfail('owner', m, conn)
        throw false
      }
      conn.callWhitelistMode = isEnable
      break
    case 'restrict':
      isAll = true
      if(!isROwner) {
        global.dfail('rowner', m, conn)
        throw false
      }
      global.opts['restrict'] = isEnable
      break
    case 'nyimak':
      isAll = true
      if(!isROwner) {
        global.dfail('rowner', m, conn)
        throw false
      }
      global.opts['nyimak'] = isEnable
      break
    case 'autoread':
      isAll = true
      if(!isROwner) {
        global.dfail('rowner', m, conn)
        throw false
      }
      global.opts['autoread'] = isEnable
      settings.autoread = isEnable
      break
    case 'pconly':
    case 'privateonly':
      isAll = true
      if(!isROwner) {
        global.dfail('rowner', m, conn)
        throw false
      }
      global.opts['pconly'] = isEnable
      break
    case 'gconly':
    case 'grouponly':
      isAll = true
      if(!isROwner) {
        global.dfail('rowner', m, conn)
        throw false
      }
      global.opts['gconly'] = isEnable
      settings.gconly = isEnable
      break
    case 'swonly':
    case 'statusonly':
      isAll = true
      if(!isROwner) {
        global.dfail('rowner', m, conn)
        throw false
      }
      global.opts['swonly'] = isEnable
      break
    case 'game':
      isAll = true
      if(!isOwner) {
        global.dfail('owner', m, conn)
        throw false
      }
      settings.game = isEnable
      break
    case 'rpg':
      isAll = true
      if(!isOwner) {
        global.dfail('owner', m, conn)
        throw false
      }
      settings.rpg = isEnable
      break
    case 'backup':
      isAll = true
      if(!isOwner) {
        global.dfail('owner', m, conn)
        throw false
      }
      settings.backup = isEnable
      break
    case 'viewonce':
      if(m.isGroup) {
        if(!(isAdmin || isOwner)) {
          global.dfail('admin', m, conn)
          throw false
        }
      }
      chat.viewonce = isEnable
      break
    default:
      if(!/[01]/.test(command)) return m.reply(`
List option : ${isOwner ? '\n\n∘ anticall\n∘ autoread\n∘ gconly\n∘ pconly\n∘ autoreset\n∘ game\n∘ rpg\n∘ backup\n∘ antispam\n∘ public' : ''}
∘ welcome
∘ delete 
∘ download
∘ document
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
handler.command = /^((en|dis)able|(tru|fals)e|(turn)?o(n|ff)|[01])$/i

module.exports = handler