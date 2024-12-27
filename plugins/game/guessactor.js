let handler = async (m, {
   conn,
   usedPrefix,
   command,
   env,
   Func
}) => {
   conn.guessactor = conn.guessactor ? conn.guessactor : {}
   let id = m.chat
   if (command == 'guessactor') {
      if (id in conn.guessactor) return conn.reply(m.chat, 'Masih ada soal yang belum terjawab ^', conn.guessactor[id][0])
      let json = await Api.get('api/tebakactor')
      if (!json.status) return conn.reply(m.chat, Func.jsonFormat(json), m)
      let capt = '乂  *G U E S S A C T O R*\n\n'
      capt += `Siapa nama aktor ini??\n\n`
      capt += `Waktu : [ *${env.timer / 1000 / 60} menit* ]\n`
      capt += `Balas pesan ini untuk menjawab, kirim *${usedPrefix}actorclue* untuk bantuan dan *${usedPrefix}actorskip* untuk menghapus sesi permainan.`
      conn.guessactor[id] = [
         await conn.sendFile(m.chat, json.data.image, Func.filename('jpg'), capt, m),
         json,
         setTimeout(() => {
            if (conn.guessactor[id]) conn.reply(m.chat, `Waktu habis!`, conn.guessactor[id][0])
            delete conn.guessactor[id]
         }, env.timer)
      ]
   } else if (command == 'actorclue') {
      if (!(id in conn.guessactor)) return
      let clue = conn.guessactor[id][1].data.title.replace(/[bcdfghjklmnpqrstvwxyz]/g, '_')
      conn.reply(m.chat, `Clue : *${clue}*`, m)
   } else if (command == 'actorskip') {
      if ((id in conn.guessactor)) return conn.reply(m.chat, Func.texted('bold', `🚩 Sesi permainan guessactor berhasil di hapus.`), m).then(() => {
         clearTimeout(conn.guessactor[id][3])
         delete conn.guessactor[id]
      })
   }
}
handler.help = ['guessactor']
handler.command = ['actorclue', 'actorskip']
handler.tags = ['game']
handler.limit = handler.group = handler.game = handler.register = true
module.exports = handler