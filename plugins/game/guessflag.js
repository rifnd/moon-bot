let handler = async (m, {
   conn,
   usedPrefix,
   command,
   env,
   Func
}) => {
   conn.guessflag = conn.guessflag ? conn.guessflag : {}
   let id = m.chat
   if (command == 'guessflag') {
      if (id in conn.guessflag) return conn.reply(m.chat, 'Masih ada soal yang belum terjawab ^', conn.guessflag[id][0])
      let json = await Api.get('api/tebakbendera')
      if (!json.status) return conn.reply(m.chat, Func.jsonFormat(json), m)
      let capt = '乂  *G U E S S F L A G*\n\n'
      capt += `Bendera dari negara mana ini??\n\n`
      capt += `Waktu : [ *${env.timer / 1000 / 60} menit* ]\n`
      capt += `Balas pesan ini untuk menjawab, kirim *${usedPrefix}flagclue* untuk bantuan dan *${usedPrefix}flagskip* untuk menghapus sesi permainan.`
      conn.guessflag[id] = [
         await conn.sendFile(id, json.data.img, Func.filename('jpg'), capt, m),
         json,
         setTimeout(() => {
            if (conn.guessflag[id]) conn.reply(m.chat, `Waktu habis!`, conn.guessflag[id][0])
            delete conn.guessflag[id]
         }, env.timer)
      ]
   } else if (command == 'flagclue') {
      if (!(id in conn.guessflag)) return
      let clue = conn.guessflag[id][1].data.name.replace(/[bcdfghjklmnpqrstvwxyz]/g, '_')
      conn.reply(m.chat, `Clue : *${clue}*`, m)
   } else if (command == 'flagskip') {
      if ((id in conn.guessflag)) return conn.reply(m.chat, Func.texted('bold', `🚩 Sesi permainan guessflag berhasil di hapus.`), m).then(() => {
         clearTimeout(conn.guessflag[id][3])
         delete conn.guessflag[id]
      })
   }
}
handler.help = ['guessflag']
handler.command = ['flagclue', 'flagskip']
handler.tags = ['game']
handler.limit = handler.group = handler.game = handler.register = true
module.exports = handler