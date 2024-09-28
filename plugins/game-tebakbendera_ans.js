const similarity = require('similarity')
const threshold = 0.72
module.exports = {
   async before(m, {
      users,
      body,
      Func
   }) {
      let id = m.chat
      this.tebakbendera = this.tebakbendera ? this.tebakbendera : {}
      if (m.quoted && /tekbe untuk bantuan/i.test(m.quoted.text) && !m.fromMe) {
         if (!(id in this.tebakbendera) && /tekbe untuk bantuan/i.test(m.quoted.text)) return m.reply('Soal itu telah berakhir')
         if (m.quoted.id == this.tebakbendera[id][0].id) {
            if (['Timeout', ''].includes(body)) return !0
            let json = JSON.parse(JSON.stringify(this.tebakbendera[id][1]))
            if (body.toLowerCase() == json.name.toLowerCase().trim()) {
               await m.reply(`*Benar*, *+ ${Func.formatNumber(this.tebakbendera[id][2])} Exp*`).then(() => {
                  users.exp += this.tebakbendera[id][2]
                  clearTimeout(this.tebakbendera[id][3])
                  delete this.tebakbendera[id]
               })
            } else if (similarity(body.toLowerCase(), json.name.toLowerCase().trim()) >= threshold) m.reply(`*Dikit Lagi!*`)
            else m.reply(`*Salah!*`)
         }
      }
      return !0
   }
}