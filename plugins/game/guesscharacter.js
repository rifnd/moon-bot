let handler = async (m, {
   conn,
   usedPrefix,
   command,
   env,
   Func
}) => {
   conn.guesscharacter = conn.guesscharacter ? conn.guesscharacter : {}
   let id = m.chat
   if (command == 'guesscharacter') {
      if (id in conn.guesscharacter) return conn.reply(m.chat, 'Masih ada soal yang belum terjawab ^', conn.guesscharacter[id][0])
      let json = await Api.get('api/tebakanime')
      if (!json.status) return conn.reply(m.chat, Func.jsonFormat(json), m)
      let capt = '乂  *G U E S S C H A R A C T H E R*\n\n'
      capt += `Siapa nama karakter ini??\n\n`
      capt += `Waktu : [ *${env.timer / 1000 / 60} menit* ]\n`
      capt += `Balas pesan ini untuk menjawab, kirim *${usedPrefix}characterclue* untuk bantuan dan *${usedPrefix}characterskip* untuk menghapus sesi permainan.`
      conn.guesscharacter[id] = [
         await conn.sendFile(id, json.data.image, Func.filename('jpg'), capt, m),
         json,
         setTimeout(() => {
            if (conn.guesscharacter[id]) conn.reply(m.chat, `Waktu habis!`, conn.guesscharacter[id][0])
            delete conn.guesscharacter[id]
         }, env.timer)
      ]
   } else if (command == 'characterclue') {
      if (!(id in conn.guesscharacter)) return
      let clue = conn.guesscharacter[id][1].data.title.replace(/[bcdfghjklmnpqrstvwxyz]/g, '_')
      conn.reply(m.chat, `Clue : *${clue}*`, m)
   } else if (command == 'characterskip') {
      if ((id in conn.guesscharacter)) return conn.reply(m.chat, Func.texted('bold', `🚩 Sesi permainan guesscharacter berhasil di hapus.`), m).then(() => {
         clearTimeout(conn.guesscharacter[id][3])
         delete conn.guesscharacter[id]
      })
   }
}
handler.help = ['guesscharacter']
handler.command = ['characterclue', 'characterskip']
handler.tags = ['game']
handler.limit = handler.group = handler.game = handler.register = true
module.exports = handler