let handler = async (m, {
   conn,
   usedPrefix,
   command,
   env,
   Func
}) => {
   conn.guessplanet = conn.guessplanet ? conn.guessplanet : {}
   let id = m.chat
   if (command == 'guessplanet') {
      if (id in conn.guessplanet) return conn.reply(m.chat, 'Masih ada soal yang belum terjawab ^', conn.guessplanet[id][0])
      let json = await Api.get('api/tebakplanet')
      if (!json.status) return conn.reply(m.chat, Func.jsonFormat(json), m)
      let capt = '乂  *G U E S S P L A N E T*\n\n'
      capt += `Apa nama planet pada gambar ini??\n\n`
      capt += `Waktu : [ *${env.timer / 1000 / 60} menit* ]\n`
      capt += `Balas pesan ini untuk menjawab, kirim *${usedPrefix}planetclue* untuk bantuan dan *${usedPrefix}planetskip* untuk menghapus sesi permainan.`
      conn.guessplanet[id] = [
         await conn.sendFile(m.chat, json.data.image, Func.filename('jpg'), capt, m),
         json,
         setTimeout(() => {
            if (conn.guessplanet[id]) conn.reply(m.chat, `Waktu habis!`, conn.guessplanet[id][0])
            delete conn.guessplanet[id]
         }, env.timer)
      ]
   } else if (command == 'planetclue') {
      if (!(id in conn.guessplanet)) return
      let clue = conn.guessplanet[id][1].data.title.replace(/[aiueo]/g, '_')
      conn.reply(m.chat, `Clue : *${clue}*`, m)
   } else if (command == 'planetskip') {
      if ((id in conn.guessplanet)) return conn.reply(m.chat, Func.texted('bold', `🚩 Sesi permainan guessplanet berhasil di hapus.`), m).then(() => {
         clearTimeout(conn.guessplanet[id][3])
         delete conn.guessplanet[id]
      })
   }
}
handler.help = ['guessplanet']
handler.command = ['planetclue', 'planetskip']
handler.tags = ['game']
handler.limit = handler.group = handler.game = handler.register = true
module.exports = handler