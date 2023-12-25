let { MessageType } = require('@whiskeysockets/baileys')
let handler = async (m, { conn, command, text, usedPrefix }) => {
  function no(number) {
    return number.replace(/\s/g, '').replace(/([@+-])/g, '')
  }
  var hl = []
  hl[0] = text.split('|')[0]
  hl[0] = no(hl[0]) + '@s.whatsapp.net'
  hl[1] = text.split('|')[1]
  if (!text) return conn.reply(m.chat, Func.example(usedPrefix, command, '62xx | 30'), m)
  if (typeof db.data.users[hl[0]] == 'undefined') return conn.reply(m.chat, 'Pengguna tidak terdaftar di database.', m)
  var jumlahHari = 86400000 * hl[1]
  // var jumlahHari = 1000 * text
  var now = new Date() * 1
  db.data.users[hl[0]].premium = true
  if (now < db.data.users[hl[0]].premiumTime) db.data.users[hl[0]].premiumTime += jumlahHari
  else db.data.users[hl[0]].premiumTime = now + jumlahHari
  conn.reply(m.chat, `Berhasil menambahkan akses premium kepada @${hl[0].split('@')[0]} selama ${hl[1]} hari.`, m, { contextInfo: { mentionedJid: [hl[0]] } })
  conn.reply(hl[0], `@${hl[0].split('@')[0]} premium selama ${hl[1]} Hari`, m, { contextInfo: { mentionedJid: [hl[0]] } })

}
handler.help = handler.command = ['addprem']
handler.tags = ['owner']
handler.owner = true
handler.fail = null

module.exports = handler

function msToDate(ms) {
  temp = ms
  days = Math.floor(ms / (24 * 60 * 60 * 1000));
  daysms = ms % (24 * 60 * 60 * 1000);
  hours = Math.floor((daysms) / (60 * 60 * 1000));
  hoursms = ms % (60 * 60 * 1000);
  minutes = Math.floor((hoursms) / (60 * 1000));
  minutesms = ms % (60 * 1000);
  sec = Math.floor((minutesms) / (1000));
  return days + "H " + hours + "J " + minutes + "M";
  // +minutes+":"+sec;
}