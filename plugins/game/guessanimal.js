let handler = async (m, {
   conn,
   usedPrefix,
   command,
   env,
   Func
}) => {
   conn.guessanimal = conn.guessanimal ? conn.guessanimal : {}
   let id = m.chat
   if (command == 'guessanimal') {
      if (id in conn.guessanimal) return conn.reply(m.chat, 'Masih ada soal yang belum terjawab ^', conn.guessanimal[id][0])
      let json = await Api.get('api/tebakhewan')
      if (!json.status) return conn.reply(m.chat, Func.jsonFormat(json), m)
      let capt = '乂  *G U E S S A N I M A L*\n\n'
      capt += `Siapa nama hewan ini??\n\n`
      capt += `Waktu : [ *${env.timer / 1000 / 60} menit* ]\n`
      capt += `Balas pesan ini untuk menjawab, kirim *${usedPrefix}animalclue* untuk bantuan dan *${usedPrefix}animalskip* untuk menghapus sesi permainan.`
      conn.guessanimal[id] = [
         await conn.sendFile(id, json.data.image, Func.filename('jpg'), capt, m),
         json,
         setTimeout(() => {
            if (conn.guessanimal[id]) conn.reply(m.chat, `Waktu habis!`, conn.guessanimal[id][0])
            delete conn.guessanimal[id]
         }, env.timer)
      ]
   } else if (command == 'animalclue') {
      if (!(id in conn.guessanimal)) return
      let clue = conn.guessanimal[id][1].data.title.replace(/[bcdfghjklmnpqrstvwxyz]/g, '_')
      conn.reply(m.chat, `Clue : *${clue}*`, m)
   } else if (command == 'animalskip') {
      if ((id in conn.guessanimal)) return conn.reply(m.chat, Func.texted('bold', `🚩 Sesi permainan guessanimal berhasil di hapus.`), m).then(() => {
         clearTimeout(conn.guessanimal[id][3])
         delete conn.guessanimal[id]
      })
   }
}
handler.help = ['guessanimal']
handler.command = ['animalclue', 'animalskip']
handler.tags = ['game']
handler.limit = handler.group = handler.game = handler.register = true
module.exports = handler