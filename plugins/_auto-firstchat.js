let moment = require('moment-timezone')
let handler = m => m
handler.before = async function(m) {
  if (m.chat.endsWith('broadcast')) return
  if (m.fromMe) return
  if (m.isGroup) return
  let user = global.db.data.users[m.sender]
  if (new Date - user.pc < 86400000) return // setiap 24 jam sekali
  let t = `Halo 👋\n`
  t += `I'm an automated system (whatsapp bot) that can help you with small jobs like making stickers, downloading media and more!\n`
  t += global.set.wm
  conn.sendMessageModify(m.chat, t, m, {
    largeThumb: true,
    url: db.data.settings[conn.user.jid].link
  })
  user.pc = new Date * 1
}
module.exports = handler
