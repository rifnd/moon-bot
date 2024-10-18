const similarity = require('similarity')
const threshold = 0.72
module.exports = {
   async before(m, {
      conn,
      users,
      body,
      Func
   }) {
      let id = m.chat
      conn.tebakkata = conn.tebakkata ? conn.tebakkata : {}
      if (m.quoted && /teka untuk bantuan/i.test(m.quoted.text) && !m.fromMe) {
         if (!(id in conn.tebakkata) && /teka untuk bantuan/i.test(m.quoted.text)) return m.reply('Soal itu telah berakhir')
         if (m.quoted.id == conn.tebakkata[id][0].id) {
            if (['Timeout', ''].includes(body)) return !0
            let json = JSON.parse(JSON.stringify(conn.tebakkata[id][1]))
            if (body.toLowerCase() == json.jawaban.toLowerCase().trim()) {
               await m.reply(`*Benar, +${Func.formatNumber(conn.tebakkata[id][2])} Exp*`).then(() => {
                  users.exp += conn.tebakkata[id][2]
                  clearTimeout(conn.tebakkata[id][3])
                  delete conn.tebakkata[id]
               })
            } else if (similarity(body.toLowerCase(), json.jawaban.toLowerCase().trim()) >= threshold) m.reply(`*Dikit Lagi!*`)
            else m.reply(`*Salah!*`)
         }
      }
      return !0
   }
}