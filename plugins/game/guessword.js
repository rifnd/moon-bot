let handler = async (m, {
   conn,
   usedPrefix,
   command,
   env,
   Func
}) => {
   conn.guessword = conn.guessword ? conn.guessword : {}
   let id = m.chat
   if (command == 'guessword') {
      if (id in conn.guessword) return conn.reply(m.chat, 'Masih ada soal yang belum terjawab ^', conn.guessword[id][0])
      let json = await Api.get('api/tebakkata')
      if (!json.status) return conn.reply(m.chat, Func.jsonFormat(json), m)
      let capt = '乂  *G U E S S W O R D*\n\n'
      capt += `${json.data.soal}\n\n`
      capt += `Waktu : [ *${env.timer / 1000 / 60} menit* ]\n`
      capt += `Balas pesan ini untuk menjawab, kirim *${usedPrefix}wordclue* untuk bantuan dan *${usedPrefix}wordskip* untuk menghapus sesi permainan.`
      conn.guessword[id] = [
         await conn.reply(id, capt, m),
         json,
         setTimeout(() => {
            if (conn.guessword[id]) conn.reply(m.chat, `Waktu habis!`, conn.guessword[id][0])
            delete conn.guessword[id]
         }, env.timer)
      ]
   } else if (command == 'wordclue') {
      if (!(id in conn.guessword)) return
      let clue = conn.guessword[id][1].data.jawaban.replace(/[aiueo]/g, '_')
      conn.reply(m.chat, `Clue : *${clue}*`, m)
   } else if (command == 'wordskip') {
      if ((id in conn.guessword)) return conn.reply(m.chat, Func.texted('bold', `🚩 Sesi permainan guessword berhasil di hapus.`), m).then(() => {
         clearTimeout(conn.guessword[id][3])
         delete conn.guessword[id]
      })
   }
}
handler.help = ['guessword']
handler.command = ['wordclue', 'wordskip']
handler.tags = ['game']
handler.limit = handler.group = handler.game = handler.register = true
module.exports = handler