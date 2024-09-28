const similarity = require('similarity')
const threshold = 0.72
module.exports = {
   async before(m, {
      users,
      body,
      Func
   }) {
      let id = m.chat
      this.susunkata = this.susunkata ? this.susunkata : {}
      if (m.quoted && /suska untuk bantuan/i.test(m.quoted.text) && !m.fromMe) {
         if (!(id in this.susunkata) && /suska untuk bantuan/i.test(m.quoted.text)) return m.reply('Soal itu telah berakhir')
         if (m.quoted.id == this.susunkata[id][0].id) {
            if (['Timeout', ''].includes(body)) return !0
            let json = JSON.parse(JSON.stringify(this.susunkata[id][1]))
            if (body.toLowerCase() == json.jawaban.toLowerCase().trim()) {
               await m.reply(`*Benar*, *+ ${Func.formatNumber(this.susunkata[id][2])} Exp*`).then(() => {
                  users.exp += this.susunkata[id][2]
                  clearTimeout(this.susunkata[id][3])
                  delete this.susunkata[id]
               })
            } else if (similarity(body.toLowerCase(), json.jawaban.toLowerCase().trim()) >= threshold) m.reply(`*Dikit Lagi!*`)
            else m.reply(`*Salah!*`)
         }
      }
      return true
   }
}