let moment = require('moment-timezone')
let handler = m => m
handler.before = async function(m) {
  if (m.chat.endsWith('broadcast')) return
  if (m.fromMe) return
  if (m.isGroup) return
  let user = global.db.data.users[m.sender]
  let { banned } = db.data.users[m.chat]
  let username = conn.getName(m.sender)
  if (new Date - user.pc < 86400000) return // setiap 24 jam sekali
  conn.sendMessageModify(m.chat, `Can I help you?\nI am a whatsapp bot that can help you to do small activities such as making stickers downloading media only through whatsapp.`, m, {
    largeThumb: true,
    url: global.set.link
  })
  user.pc = new Date * 1
}
module.exports = handler

function ucapan() {
  let time = moment.tz('Asia/Jakarta').format('HH')
  let res = `Don't forget to sleep`
  if (time >= 5) res = `Good Morning`
  if (time >= 11) res = `Good Afternoon`
  if (time >= 15) res = `Good Afternoon`
  if (time >= 18) res = `Good Evening`
  if (time >= 19) res = `Good Night`
  return res
}
