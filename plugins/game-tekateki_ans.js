const similarity = require('similarity')
const threshold = 0.72
module.exports = {
   async before(m, {
      users,
      body,
      Func
   }) {
      let id = m.chat
      this.tekateki = this.tekateki ? this.tekateki : {}
      if (m.quoted && /tekki untuk bantuan/i.test(m.quoted.text) && !m.fromMe) {
         if (!(id in this.tekateki) && /tekki untuk bantuan/i.test(m.quoted.text)) return m.reply('Soal itu telah berakhir')
         if (m.quoted.id == this.tekateki[id][0].id) {
            if (['Timeout', ''].includes(body)) return !0
            let json = JSON.parse(JSON.stringify(this.tekateki[id][1]))
            if (body.toLowerCase() == json.jawaban.toLowerCase().trim()) {
               await m.reply(`*Benar*, *+ ${Func.formatNumber(this.tekateki[id][2])} Exp*`).then(() => {
                  users.exp += this.tekateki[id][2]
                  clearTimeout(this.tekateki[id][3])
                  delete this.tekateki[id]
               })
            } else if (similarity(m.text.toLowerCase(), json.jawaban.toLowerCase().trim()) >= threshold) m.reply(`*Dikit Lagi!*`)
            else m.reply(`*Salah!*`)
         }
      }
      return !0
   }
}