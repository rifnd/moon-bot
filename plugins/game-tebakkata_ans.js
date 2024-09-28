const similarity = require('similarity')
const threshold = 0.72
module.exports = {
   async before(m, {
      users,
      body,
      Func
   }) {
      let id = m.chat
      this.tebakkata = this.tebakkata ? this.tebakkata : {}
      if (m.quoted && /teka untuk bantuan/i.test(m.quoted.text) && !m.fromMe) {
         if (!(id in this.tebakkata) && /teka untuk bantuan/i.test(m.quoted.text)) return m.reply('Soal itu telah berakhir')
         if (m.quoted.id == this.tebakkata[id][0].id) {
            if (['Timeout', ''].includes(body)) return !0
            let json = JSON.parse(JSON.stringify(this.tebakkata[id][1]))
            if (body.toLowerCase() == json.jawaban.toLowerCase().trim()) {
               await m.reply(`*Benar*, *+ ${Func.formatNumber(this.tebakkata[id][2])} Exp*`).then(() => {
                  users.exp += this.tebakkata[id][2]
                  clearTimeout(this.tebakkata[id][3])
                  delete this.tebakkata[id]
               })
            } else if (similarity(body.toLowerCase(), json.jawaban.toLowerCase().trim()) >= threshold) m.reply(`*Dikit Lagi!*`)
            else m.reply(`*Salah!*`)
         }
      }
      return !0
   }
}