const similarity = require('similarity')
const threshold = 0.72
module.exports = {
   async before(m, {
      users,
      body,
      Func
   }) {
      let id = m.chat
      this.tebaklirik = this.tebaklirik ? this.tebaklirik : {}
      if (m.quoted && /teli untuk bantuan/i.test(m.quoted.text) && !m.fromMe) {
         if (!(id in this.tebaklirik) && /teli untuk bantuan/i.test(m.quoted.text)) return m.reply('Soal itu telah berakhir')
         if (m.quoted.id == this.tebaklirik[id][0].id) {
            if (['Timeout', ''].includes(body)) return !0
            let json = JSON.parse(JSON.stringify(this.tebaklirik[id][1]))
            if (body.toLowerCase() == json.jawaban.toLowerCase().trim()) {
               await m.reply(`*Benar*, *+ ${Func.formatNumber(this.tebaklirik[id][2])} Exp*`).then(() => {
                  users.exp += this.tebaklirik[id][2]
                  clearTimeout(this.tebaklirik[id][3])
                  delete this.tebaklirik[id]
               })
            } else if (similarity(body.toLowerCase(), json.jawaban.toLowerCase().trim()) >= threshold) m.reply(`*Dikit Lagi!*`)
            else m.reply(`*Salah!*`)
         }
      }
      return true
   }
}