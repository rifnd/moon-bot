const similarity = require('similarity')
const threshold = 0.72
module.exports = {
   async before(m, {
      users,
      body,
      Func
   }) {
      let id = m.chat
      this.siapakahaku = this.siapakahaku ? this.siapakahaku : {}
      if (m.quoted && /who untuk bantuan/i.test(m.quoted.text) && !m.fromMe) {
         if (!(id in this.siapakahaku) && /who untuk bantuan/i.test(m.quoted.text)) return m.reply('Soal itu telah berakhir')
         if (m.quoted.id == this.siapakahaku[id][0].id) {
            if (['Timeout', ''].includes(body)) return !0
            let json = JSON.parse(JSON.stringify(this.siapakahaku[id][1]))
            if (body.toLowerCase() == json.jawaban.toLowerCase().trim()) {
               await m.reply(`*Benar*, *+ ${Func.formatNumber(this.siapakahaku[id][2])} Exp*`).then(() => {
                  users.exp += this.siapakahaku[id][2]
                  clearTimeout(this.siapakahaku[id][3])
                  delete this.siapakahaku[id]
               })
            } else if (similarity(body.toLowerCase(), json.jawaban.toLowerCase().trim()) >= threshold) m.reply(`*Dikit Lagi!*`)
            else m.reply(`*Salah!*`)
         }
      }
      return !0
   }
}