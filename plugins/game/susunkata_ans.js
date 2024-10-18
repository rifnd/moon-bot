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
      conn.susunkata = conn.susunkata ? conn.susunkata : {}
      if (m.quoted && /suska untuk bantuan/i.test(m.quoted.text) && !m.fromMe) {
         if (!(id in conn.susunkata) && /suska untuk bantuan/i.test(m.quoted.text)) return m.reply('Soal itu telah berakhir')
         if (m.quoted.id == conn.susunkata[id][0].id) {
            if (['Timeout', ''].includes(body)) return !0
            let json = JSON.parse(JSON.stringify(conn.susunkata[id][1]))
            if (body.toLowerCase() == json.jawaban.toLowerCase().trim()) {
               await m.reply(`*Benar, +${Func.formatNumber(conn.susunkata[id][2])} Exp*`).then(() => {
                  users.exp += conn.susunkata[id][2]
                  clearTimeout(conn.susunkata[id][3])
                  delete conn.susunkata[id]
               })
            } else if (similarity(body.toLowerCase(), json.jawaban.toLowerCase().trim()) >= threshold) m.reply(`*Dikit Lagi!*`)
            else m.reply(`*Salah!*`)
         }
      }
      return true
   }
}