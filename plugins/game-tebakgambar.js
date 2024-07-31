module.exports = {
   run: async (m, {
      conn,
      usedPrefix,
      command,
      Func
   }) => {
      conn.tebakgambar = conn.tebakgambar ? conn.tebakgambar : {}
      let id = m.chat
      let timeout = 120000
      let poin = Func.randomInt('1000', '50000')
      if (command == 'tebakgambar') {
         if (id in conn.tebakgambar) conn.reply(m.chat, 'Masih ada soal belum terjawab di chat ini', conn.tebakgambar[id][0])
         let src = await Func.fetchJson('https://raw.githubusercontent.com/BochilTeam/database/master/games/tebakgambar.json')
         let json = src[Math.floor(Math.random() * src.length)]
         let capt = `乂  *T E B A K G A M B A R*\n\n`
         capt += `${json.deskripsi}\n\n`
         capt += `Timeout : ${timeout / 60 / 1000} menit\n`
         capt += `Balas pesan ini untuk menjawab, kirim ${usedPrefix}hint untuk bantuan`
         conn.tebakgambar[id] = [
            await conn.sendMessage(m.chat, {
               image: { url: json.img }, caption: capt
            }, { quoted: m }),
            json,
            poin,
            setTimeout(() => {
               if (conn.tebakgambar[id]) conn.reply(m.chat, `Waktu habis!\nJawabannya adalah *${json.jawaban}*`, conn.tebakgambar[id][0])
               delete conn.tebakgambar[id]
            }, timeout)
         ]
      } else if (command == 'hint') {
         if (!(id in conn.tebakgambar)) throw false
         let clue = conn.tebakgambar[id][1].jawaban.replace(/[AIUEOaiueo]/g, '_')
         conn.reply(m.chat, '```' + clue + '```\nBalas soalnya, bukan pesan ini', conn.tebakgambar[id][0])
      }
   },
   help: ['tebakgambar'],
   tags: ['game'],
   command: /^(tebakgambar|hint)$/i,
   group: true,
   game: true,
   limit: true
}