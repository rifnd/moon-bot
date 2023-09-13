let { MessageType } = require('@whiskeysockets/baileys')
let handler = async (m, {
  conn, 
  command, 
  args, 
  usedPrefix: p, 
  isOwner, 
  DevMode
}) => {
  if (!isOwner) return !0
  let type = (args[0] || '').toLowerCase()
  let cht = (args[0] || '').toLowerCase()
  let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0]: m.fromMe ? conn.user.jid: m.sender
  let mentionedJid = [who]
  let cok = `What can be added Exp, Money, Limit
  Example : ${p}pay exp 10 @628123456789`
  try {
    if (/pay/i.test(command)) {
      const count = args[1] && args[1].length > 0 ? Math.max(parseInt(args[1]), 1) : !args[1] || args.length < 3 ? 1: Math.min(1, count)
      switch (type) {
        case 'exp':
          if (typeof db.data.users[who] == 'undefined') return m.reply('The user does not exist in the database')
          db.data.users[who].exp += count * 1
          conn.reply(m.chat, `Added successfully ${count * 1} ${type}`, m)
          break // Attention, the exp cheat can make your database error!!
        // Minimum cheat exp 1000000000000 Cheat exp limit cannot be more!!
        case 'Money':
          if (typeof db.data.users[who] == 'undefined') return m.reply('The user does not exist in the database')
          db.data.users[who].money += count * 1
          conn.reply(m.chat, `Added successfully ${count * 1} ${type}`, m)
        case 'limit':
          if (typeof db.data.users[who] == 'undefined') return m.reply('Pengguna tidak ada di dalam database')
          db.data.users[who].limit += count * 1
          conn.reply(m.chat, `Added successfully ${count * 1} ${type}`, m)
          break
        default:
          return conn.reply(m.chat, cok, m)
      }
    }
  } catch (e) {
    conn.reply(m.chat, cok, m)
    console.log(e)
  }
}
handler.help = handler.command = ['pay']
handler.tags = ['owner']
handler.fail = null
handler.owner = true
module.exports = handler

function pickRandom(list) {
  return list[Math.floor(Math.random() * list.length)]
}
function no(number) {
  return number.replace(/\s/g, '').replace(/([@+-])/g, '')
}