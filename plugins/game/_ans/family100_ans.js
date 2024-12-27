let handler = (m) => m
handler.before = async function (m, {
   conn,
   prefixes,
   body,
   env,
   users,
   Func
}) {
   try {
      conn.family100 = conn.family100 ? conn.family100 : {}
      let id = 'family100_' + m.chat
      if (!(id in conn.family100)) return !0
      let room = conn.family100[id]
      let text = m.text.toLowerCase().replace(/[^\w\s\-]+/, '')
      let isSurrender = /^((me)?nyerah|surr?ender)$/i.test(m.text)
      if (!isSurrender) {
         let index = room.jawaban.indexOf(text)
         if (index < 0) {
            if (Math.max(...room.jawaban.filter((_, index) => !room.terjawab[index]).map(jawaban => similarity(jawaban, text))) >= threshold) m.reply('Dikit lagi!')
            return !0
         }
         if (room.terjawab[index]) return !0
         let users = global.db.users[m.sender]
         room.terjawab[index] = m.sender
         users.exp += room.winScore
      }
      let isWin = room.terjawab.length === room.terjawab.filter(v => v).length
      let caption = `
*Soal:* ${room.soal}

Terdapat *${room.jawaban.length}* jawaban${room.jawaban.find(v => v.includes(' ')) ? `
(beberapa jawaban terdapat spasi)`: ''}
${isWin ? `*SEMUA JAWABAN TERJAWAB*` : isSurrender ? '*MENYERAH!*' : ''}
${Array.from(room.jawaban, (jawaban, index) => { return isSurrender || room.terjawab[index] ? `(${index + 1}) ${jawaban} ${room.terjawab[index] ? '@' + room.terjawab[index].split('@')[0] : ''}`.trim() : false }).filter(v => v).join('\n')}

${isSurrender ? '' : `+${Func.formatNumber(room.winScore)} EXP tiap jawaban benar`}`.trim()
      m.reply(caption).then(msg => {
         return conn.family100[id].msg = msg
      }).catch(_ => _)
      if (isWin || isSurrender) delete conn.family100[id]
   } catch (e) {
      console.log(e)
   }
   return true
}
module.exports = handler