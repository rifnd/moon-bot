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
      conn.lengkapikalimat = conn.lengkapikalimat ? conn.lengkapikalimat : {}
      if (m.quoted && /leka untuk bantuan/i.test(m.quoted.text) && !m.fromMe) {
         if (!(id in conn.lengkapikalimat) && /leka untuk bantuan/i.test(m.quoted.text)) return m.reply('Soal itu telah berakhir')
         if (m.quoted.id == conn.lengkapikalimat[id][0].key.id) {
            if (['Timeout', ''].includes(body)) return !0
            let json = JSON.parse(JSON.stringify(conn.lengkapikalimat[id][1]))
            if (body.toLowerCase() == json.jawaban.toLowerCase().trim()) {
               await m.reply(`*Benar, +${Func.formatNumber(conn.lengkapikalimat[id][2])} Exp*`).then(() => {
                  users.exp += conn.lengkapikalimat[id][2]
                  clearTimeout(conn.lengkapikalimat[id][3])
                  delete conn.lengkapikalimat[id]
               })
            } else if (similarity(body.toLowerCase(), json.jawaban.toLowerCase().trim()) >= threshold) m.reply(`*Dikit Lagi!*`)
            else m.reply(`*Salah!*`)
         }
      }
      return !0
   }
}