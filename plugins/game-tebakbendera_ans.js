const similarity = require('similarity')
const threshold = 0.72
module.exports = {
   async before(m, {
      conn,
      users,
      Func
   }) {
      let id = m.chat
      conn.tebakbendera = conn.tebakbendera ? conn.tebakbendera : {}
      if (m.quoted && /tekbe untuk bantuan/i.test(m.quoted.text) && !m.fromMe) {
         if (!(id in conn.tebakbendera) && /tekbe untuk bantuan/i.test(m.quoted.text)) return m.reply('Soal itu telah berakhir')
         if (m.quoted.id == conn.tebakbendera[id][0].id) {
            if (['Timeout', ''].includes(m.text)) return !0
            let json = JSON.parse(JSON.stringify(conn.tebakbendera[id][1]))
            if (m.text.toLowerCase() == json.name.toLowerCase().trim()) {
               await m.reply(`*Benar*, *+ ${Func.formatNumber(conn.tebakbendera[id][2])} Exp*`).then(() => {
                  users.exp += conn.tebakbendera[id][2]
                  clearTimeout(conn.tebakbendera[id][3])
                  delete conn.tebakbendera[id]
               })
            } else if (similarity(m.text.toLowerCase(), json.name.toLowerCase().trim()) >= threshold) m.reply(`*Dikit Lagi!*`)
            else m.reply(`*Salah!*`)
         }
      }
      return true
   }
}