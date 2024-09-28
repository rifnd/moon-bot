const similarity = require('similarity')
const threshold = 0.72
module.exports = {
   async before(m, {
      users,
      body,
      Func
   }) {
      let id = m.chat
      this.lengkapikalimat = this.lengkapikalimat ? this.lengkapikalimat : {}
      if (m.quoted && /leka untuk bantuan/i.test(m.quoted.text) && !m.fromMe) {
         if (!(id in this.lengkapikalimat) && /leka untuk bantuan/i.test(m.quoted.text)) return m.reply('Soal itu telah berakhir')
         if (m.quoted.id == this.lengkapikalimat[id][0].key.id) {
            if (['Timeout', ''].includes(body)) return !0
            let json = JSON.parse(JSON.stringify(this.lengkapikalimat[id][1]))
            if (body.toLowerCase() == json.jawaban.toLowerCase().trim()) {
               await m.reply(`*Benar*, *+ ${Func.formatNumber(this.lengkapikalimat[id][2])} Exp*`).then(() => {
                  users.exp += this.lengkapikalimat[id][2]
                  clearTimeout(this.lengkapikalimat[id][3])
                  delete this.lengkapikalimat[id]
               })
            } else if (similarity(body.toLowerCase(), json.jawaban.toLowerCase().trim()) >= threshold) m.reply(`*Dikit Lagi!*`)
            else m.reply(`*Salah!*`)
         }
      }
      return !0
   }
}