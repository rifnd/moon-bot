const similarity = require('similarity')
const threshold = 0.72
let handler = m => m
handler.before = async function (m, {
   conn,
   users
}) {
   let id = m.chat
   if (m.quoted && m.quoted.sender != conn.decodeJid(conn.user.jid)) return
   if (m.quoted && /leka untuk bantuan/i.test(m.quoted.text)) {
      if (!(id in conn.lengkapikalimat) && /leka untuk bantuan/i.test(m.quoted.text) && !m.quoted.sender) return m.reply('Soal itu telah berakhir')
      if (m.quoted.id == conn.lengkapikalimat[id][0].id) {
         if (['Timeout', ''].includes(m.text)) return !0
         let json = JSON.parse(JSON.stringify(conn.lengkapikalimat[id][1]))
         if (m.text.toLowerCase() == json.jawaban.toLowerCase().trim()) {
            await m.reply('*Benar*').then(() => {
               conn.reply(m.chat, `*+ ${Func.formatNumber(conn.lengkapikalimat[id][2])} exp*`, m)
               users.exp += conn.lengkapikalimat[id][2]
               clearTimeout(conn.lengkapikalimat[id][3])
               delete conn.lengkapikalimat[id]
            })
         } else if (similarity(m.text.toLowerCase(), json.jawaban.toLowerCase().trim()) >= threshold) m.reply(`*Dikit Lagi!*`)
         else m.reply(`*Salah!*`)
      }
   }
   return !0
}
handler.exp = 0
module.exports = handler