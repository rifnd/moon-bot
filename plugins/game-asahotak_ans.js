const similarity = require('similarity')
const threshold = 0.72
let handler = m => m
handler.before = async function (m, {
   conn,
   users
}) {
   let id = m.chat
   if (m.quoted && m.quoted.sender != conn.decodeJid(conn.user.jid)) return
   if (m.quoted && /ao untuk bantuan/i.test(m.quoted.text)) {
      if (!(id in conn.asahotak) && /ao untuk bantuan/i.test(m.quoted.text) && !m.quoted.sender) return m.reply('Soal itu telah berakhir')
      if (m.quoted.id == conn.asahotak[id][0].id) {
         if (['Timeout', ''].includes(m.text)) return !0
         let json = JSON.parse(JSON.stringify(conn.asahotak[id][1]))
         if (m.text.toLowerCase() == json.jawaban.toLowerCase().trim()) {
            await m.reply('*Benar*').then(() => {
               conn.reply(m.chat, `*+ ${Func.formatNumber(conn.asahotak[id][2])} exp*`, m)
               users.exp += conn.asahotak[id][2]
               clearTimeout(conn.asahotak[id][3])
               delete conn.asahotak[id]
            })
         } else if (similarity(m.text.toLowerCase(), json.jawaban.toLowerCase().trim()) >= threshold) m.reply(`*Dikit Lagi!*`)
         else m.reply(`*Salah!*`)
      }
   }
   return !0
}
handler.exp = 0
module.exports = handler