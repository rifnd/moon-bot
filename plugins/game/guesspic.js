let handler = async (m, {
   conn,
   usedPrefix,
   command,
   env,
   Func
}) => {
   conn.guesspic = conn.guesspic ? conn.guesspic : {}
   let id = m.chat
   if (command == 'guesspic') {  
      if (id in conn.guesspic) return conn.reply(m.chat, 'Masih ada soal yang belum terjawab ^', conn.guesspic[id][0])
      let json = await Func.jsonRandom('https://raw.githubusercontent.com/rifnd/db/refs/heads/master/games/tebakgambar.json')
      let capt = '乂  *G U E S S P I C*\n\n'
      capt += `${json.deskripsi}\n\n`
      capt += `Waktu : [ *${env.timer / 1000 / 60} menit* ]\n`
      capt += `Balas pesan ini untuk menjawab, kirim *${usedPrefix}picclue* untuk bantuan dan *${usedPrefix}picskip* untuk menghapus sesi permainan.`
      conn.guesspic[id] = [
         await conn.sendFile(id, json.img, Func.filename('jpg'), capt, m),
         json,
         setTimeout(() => {
            if (conn.guesspic[id]) conn.reply(m.chat, `Waktu habis!`, conn.guesspic[id][0])
            delete conn.guesspic[id]
         }, env.timer)
      ]
   } else if (command == 'picclue') {
      if (!(id in conn.guesspic)) return
      let clue = conn.guesspic[id][1].jawaban.replace(/[BCDFGHJKLMNPQRSTVWXYZ]/g, '_')
      conn.reply(m.chat, `Clue : *${clue}*`, m)
   } else if (command == 'picskip') {
      if ((id in conn.guesspic)) return conn.reply(m.chat, Func.texted('bold', `🚩 Sesi permainan guesspic berhasil di hapus.`), m).then(() => {
         clearTimeout(conn.guesspic[id][3])
         delete conn.guesspic[id]
      })
   }
}
handler.help = ['guesspic'] 
handler.command = ['picclue', 'picskip']
handler.tags = ['game']
handler.limit = handler.group = handler.game = handler.register = true
module.exports = handler 