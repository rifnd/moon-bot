module.exports = {
   help: ['tebakanime'],
   tags: ['game'],
   command: /^(tebakanime|nimeclue)$/i,
   run: async (m, {
      conn,
      usedPrefix,
      command,
      Func
   }) => {
      conn.tebakanime = conn.tebakanime ? conn.tebakanime : {}
      let id = m.chat
      let timeout = 120000
      let poin = Func.randomInt('1000', '50000')
      if (command == 'tebakanime') {
         if (id in conn.tebakanime) return conn.reply(m.chat, 'Masih ada soal belum terjawab di chat ini', conn.tebakanime[id][0])
         let json = await Api.get('api/tebakanime')
         if (!json.status) return conn.reply(m.chat, Func.jsonFormat(json), m)
         let capt = `乂  *T E B A K - A N I M E*\n\n`
         capt += `Siapa nama karakter anime pada gambar ini??\n\n`
         capt += `Timeout : ${timeout / 60 / 1000} menit\n`
         capt += `Balas pesan ini untuk menjawab, kirim ${usedPrefix}nimeclue untuk bantuan`
         conn.tebakanime[id] = [
            await conn.sendMessage(m.chat, {
               image: { url: json.data.image }, caption: capt
            }, { quoted: m }),
            json,
            poin,
            setTimeout(() => {
               if (conn.tebakanime[id]) conn.reply(m.chat, `Waktu habis!\nJawabannya adalah *${json.data.title}*`, conn.tebakanime[id][0])
               delete conn.tebakanime[id]
            }, timeout)
         ]
      } else if (command == 'nimeclue') {
         if (!(id in conn.tebakanime)) throw false
         let clue = conn.tebakanime[id][1].data.title.replace(/[AIUEOaiueo]/g, '_')
         conn.reply(m.chat, '```' + clue + '```\nBalas soalnya, bukan pesan ini', conn.tebakanime[id][0])
      }
   },
   group: true,
   game: true,
   limit: true
}