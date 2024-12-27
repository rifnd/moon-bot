let handler = async (m, {
   conn,
   usedPrefix,
   command,
   env,
   Func
}) => {
   conn.guesssong = conn.guesssong ? conn.guesssong : {}
   let id = m.chat
   if (command == 'guesssong') {
      if (id in conn.guesssong) return conn.reply(m.chat, 'Masih ada soal yang belum terjawab ^', conn.guesssong[id][0])
      let json = await Api.get('api/tebaklagu')
      if (!json.status) return conn.reply(m.chat, Func.jsonFormat(json), m)
      let audio = await conn.sendFile(m.chat, json.data.lagu, 'audio.mp3', '', m)
      let capt = '乂  *G U E S S S O N G*\n\n'
      capt += `Apa judul dari potongan lagu ini?\n\n`
      capt += `Waktu : [ *${env.timer / 1000 / 60} menit* ]\n`
      capt += `Balas pesan ini untuk menjawab, kirim *${usedPrefix}songclue* untuk bantuan dan *${usedPrefix}songskip* untuk menghapus sesi permainan.`
      conn.guesssong[id] = [
         await conn.reply(m.chat, capt, audio),
         json,
         setTimeout(() => {
            if (conn.guesssong[id]) conn.reply(m.chat, `Waktu habis!`, conn.guesssong[id][0])
            delete conn.guesssong[id]
         }, env.timer)
      ]
   } else if (command == 'songclue') {
      if (!(id in conn.guesssong)) return
      let clue = conn.guesssong[id][1].data.judul.replace(/[aiueo]/g, '_')
      conn.reply(m.chat, `Clue : *${clue}*`, m)
   } else if (command == 'songskip') {
      if ((id in conn.guesssong)) return conn.reply(m.chat, Func.texted('bold', `🚩 Sesi permainan guesssong berhasil di hapus.`), m).then(() => {
         clearTimeout(conn.guesssong[id][3])
         delete conn.guesssong[id]
      })
   }
}
handler.help = ['guesssong']
handler.command = ['songclue', 'songskip']
handler.tags = ['game']
handler.limit = handler.group = handler.game = handler.register = true
module.exports = handler