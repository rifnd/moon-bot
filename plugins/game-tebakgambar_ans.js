const similarity = require('similarity')
const threshold = 0.72
module.exports = {
   async before(m, {
      users,
      body,
      Func
   }) {
      let id = m.chat
      this.tebakgambar = this.tebakgambar ? this.tebakgambar : {}
      if (m.quoted && /hint untuk bantuan/i.test(m.quoted.text) && !m.fromMe) {
         if (!(id in this.tebakgambar) && /hint untuk bantuan/i.test(m.quoted.text)) return m.reply('Soal itu telah berakhir')
         if (m.quoted.id == this.tebakgambar[id][0].id) {
            if (['Timeout', ''].includes(body)) return !0
            let json = JSON.parse(JSON.stringify(this.tebakgambar[id][1]))
            if (body.toLowerCase() == json.jawaban.toLowerCase().trim()) {
               await m.reply(`*Benar*, *+ ${Func.formatNumber(this.tebakgambar[id][2])} Exp*`).then(() => {
                  users.exp += this.tebakgambar[id][2]
                  clearTimeout(this.tebakgambar[id][3])
                  delete this.tebakgambar[id]
               })
            } else if (similarity(body.toLowerCase(), json.jawaban.toLowerCase().trim()) >= threshold) m.reply(`*Dikit Lagi!*`)
            else m.reply(`*Salah!*`)
         }
      }
      return true
   }
}