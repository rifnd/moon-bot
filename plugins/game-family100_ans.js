const similarity = require('similarity')
const threshold = 0.72
module.exports = {
   async before(m, {
      conn,
      Func
   }) {
      try {
         conn.game = conn.game ? conn.game : {}
         let id = 'family100_' + m.chat
         if (!(id in conn.game)) return !0
         let room = conn.game[id]
         let text = m.text.toLowerCase().replace(/[^\w\s\-]+/, '')
         let isSurrender = /^((me)?nyerah|surr?ender)$/i.test(m.text)
         if (!isSurrender) {
            let index = room.jawaban.indexOf(text)
            if (index < 0) {
               if (Math.max(...room.jawaban.filter((_, index) => !room.terjawab[index]).map(jawaban => similarity(jawaban, text))) >= threshold) m.reply('Dikit lagi!')
               return !0
            }
            if (room.terjawab[index]) return !0
            let users = global.db.data.users[m.sender]
            room.terjawab[index] = m.sender
            users.money += room.winScore
         }
         let isWin = room.terjawab.length === room.terjawab.filter(v => v).length
         let caption = `
*Soal:* ${room.soal}
   
Terdapat *${room.jawaban.length}* jawaban${room.jawaban.find(v => v.includes(' ')) ? `
(beberapa jawaban terdapat spasi)`: ''}
${isWin ? `*SEMUA JAWABAN TERJAWAB*` : isSurrender ? '*MENYERAH!*' : ''}
${Array.from(room.jawaban, (jawaban, index) => {
   return isSurrender || room.terjawab[index] ? `(${index + 1}) ${jawaban} ${room.terjawab[index] ? '@' + room.terjawab[index].split('@')[0] : ''}`.trim() : false
}).filter(v => v).join('\n')}
   
${isSurrender ? '' : `+${Func.formatNumber(room.winScore)} Money tiap jawaban benar`}`.trim()
         m.reply(caption, null, {
            contextInfo: {
               mentionedJid: conn.parseMention(caption)
            }
         }).then(msg => {
            return conn.game[id].msg = msg
         }).catch(_ => _)
         if (isWin || isSurrender) delete conn.game[id]
      } catch (e) {
         console.log(e)
      }
      return true
   }
}