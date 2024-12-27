let handler = async (m, {
   conn,
   usedPrefix,
   command,
   env,
   Func
}) => {
   conn.guesslyric = conn.guesslyric ? conn.guesslyric : {}
   let id = m.chat
   if (command == 'guesslyric') {
      if (id in conn.guesslyric) return conn.reply(m.chat, 'Masih ada soal yang belum terjawab ^', conn.guesslyric[id][0])
      let json = await Api.get('api/tebaklirik')
      if (!json.status) return conn.reply(m.chat, Func.jsonFormat(json), m)
      let capt = '乂  *G U E S S L Y R I C*\n\n'
      capt += `${json.data.soal}\n\n`
      capt += `Waktu : [ *${env.timer / 1000 / 60} menit* ]\n`
      capt += `Balas pesan ini untuk menjawab, kirim *${usedPrefix}lyricclue* untuk bantuan dan *${usedPrefix}lyricskip* untuk menghapus sesi permainan.`
      conn.guesslyric[id] = [
         await conn.reply(id, capt, m),
         json,
         setTimeout(() => {
            if (conn.guesslyric[id]) conn.reply(m.chat, `Waktu habis!`, conn.guesslyric[id][0])
            delete conn.guesslyric[id]
         }, env.timer)
      ]
   } else if (command == 'lyricclue') {
      if (!(id in conn.guesslyric)) return
      let clue = conn.guesslyric[id][1].data.jawaban.replace(/[aiueo]/g, '_')
      conn.reply(m.chat, `Clue : *${clue}*`, m)
   } else if (command == 'lyricskip') {
      if ((id in conn.guesslyric)) return conn.reply(m.chat, Func.texted('bold', `🚩 Sesi permainan guesslyric berhasil di hapus.`), m).then(() => {
         clearTimeout(conn.guesslyric[id][3])
         delete conn.guesslyric[id]
      })
   }
}
handler.help = ['guesslyric']
handler.command = ['lyricclue', 'lyricskip']
handler.tags = ['game']
handler.limit = handler.group = handler.game = handler.register = true
module.exports = handler