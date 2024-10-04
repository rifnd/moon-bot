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
      conn.tebakhewan = conn.tebakhewan ? conn.tebakhewan : {}
      if (m.quoted && /nimalclue untuk bantuan/i.test(m.quoted.text) && !m.fromMe) {
         if (!(id in conn.tebakhewan) && /nimalclue untuk bantuan/i.test(m.quoted.text)) return m.reply('Soal itu telah berakhir')
         if (m.quoted.id == conn.tebakhewan[id][0].id) {
            if (['Timeout', ''].includes(body)) return !0
            let json = JSON.parse(JSON.stringify(conn.tebakhewan[id][1]))
            if (body.toLowerCase() == json.data.title.toLowerCase().trim()) {
               await m.reply(`*Benar*, *+${Func.formatNumber(conn.tebakhewan[id][2])} Exp*`).then(() => {
                  users.exp += conn.tebakhewan[id][2]
                  clearTimeout(conn.tebakhewan[id][3])
                  delete conn.tebakhewan[id]
               })
            } else if (similarity(body.toLowerCase(), json.data.title.toLowerCase().trim()) >= threshold) m.reply(`*Dikit Lagi!*`)
            else m.reply(`*Salah!*`)
         }
      }
      return !0
   }
}