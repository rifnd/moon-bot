let handler = async (m, {
   conn,
   usedPrefix,
   command,
   env,
   Func
}) => {
   conn.guessmarvel = conn.guessmarvel ? conn.guessmarvel : {}
   let id = m.chat
   if (command == 'guessmarvel') {
      if (id in conn.guessmarvel) return conn.reply(m.chat, 'Masih ada soal yang belum terjawab ^', conn.guessmarvel[id][0])
      let json = await Api.get('api/tebakmarvel')
      if (!json.status) return conn.reply(m.chat, Func.jsonFormat(json), m)
      let capt = '乂  *G U E S S M A R V E L*\n\n'
      capt += `Apa nama hero pada gambar ini??\n\n`
      capt += `Waktu : [ *${env.timer / 1000 / 60} menit* ]\n`
      capt += `Balas pesan ini untuk menjawab, kirim *${usedPrefix}marvelclue* untuk bantuan dan *${usedPrefix}marvelskip* untuk menghapus sesi permainan.`
      conn.guessmarvel[id] = [
         await conn.sendFile(m.chat, json.data.image, Func.filename('jpg'), capt, m),
         json,
         setTimeout(() => {
            if (conn.guessmarvel[id]) conn.reply(m.chat, `Waktu habis!`, conn.guessmarvel[id][0])
            delete conn.guessmarvel[id]
         }, env.timer)
      ]
   } else if (command == 'marvelclue') {
      if (!(id in conn.guessmarvel)) return
      let clue = conn.guessmarvel[id][1].data.title.replace(/[aiueo]/g, '_')
      conn.reply(m.chat, `Clue : *${clue}*`, m)
   } else if (command == 'marvelskip') {
      if ((id in conn.guessmarvel)) return conn.reply(m.chat, Func.texted('bold', `🚩 Sesi permainan guessmarvel berhasil di hapus.`), m).then(() => {
         clearTimeout(conn.guessmarvel[id][3])
         delete conn.guessmarvel[id]
      })
   }
}
handler.help = ['guessmarvel']
handler.command = ['marvelclue', 'marvelskip']
handler.tags = ['game']
handler.limit = handler.group = handler.game = handler.register = true
module.exports = handler