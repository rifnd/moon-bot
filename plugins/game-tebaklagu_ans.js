const similarity = require('similarity')
const threshold = 0.72
module.exports = {
   async before(m, {
      users,
      body,
      Func
   }) {
      let id = m.chat
      this.tebaklagu = this.tebaklagu ? this.tebaklagu : {}
      if (m.quoted && /tegu untuk bantuan/i.test(m.quoted.text) && !m.fromMe) {
         if (!(id in this.tebaklagu) && /tegu untuk bantuan/i.test(m.quoted.text)) return m.reply('Soal itu telah berakhir')
         if (m.quoted.id == this.tebaklagu[id][0].id) {
            if (['Timeout', ''].includes(body)) return !0
            let json = JSON.parse(JSON.stringify(this.tebaklagu[id][1]))
            if (body.toLowerCase() == json.data.judul.toLowerCase().trim()) {
               await m.reply(`*Benar*, *+ ${Func.formatNumber(this.tebaklagu[id][2])} Exp*`).then(() => {
                  users.exp += this.tebaklagu[id][2]
                  clearTimeout(this.tebaklagu[id][3])
                  delete this.tebaklagu[id]
               })
            } else if (similarity(body.toLowerCase(), json.data.judul.toLowerCase().trim()) >= threshold) m.reply(`*Dikit Lagi!*`)
            else m.reply(`*Salah!*`)
         }
      }
      return !0
   }
}