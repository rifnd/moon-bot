module.exports = {
   help: ['tebakhewan'],
   tags: ['game'],
   command: /^(tebakhewan|nimalclue)$/i,
   run: async (m, {
      conn,
      usedPrefix,
      command,
      Func
   }) => {
      conn.tebakhewan = conn.tebakhewan ? conn.tebakhewan : {}
      let id = m.chat
      let timeout = 120000
      let poin = Func.randomInt('1000', '50000')
      if (command == 'tebakhewan') {
         if (id in conn.tebakhewan) return conn.reply(m.chat, 'Masih ada soal belum terjawab di chat ini', conn.tebakhewan[id][0])
         let json = await Api.get('api/tebakhewan')
         if (!json.status) return conn.reply(m.chat, Func.jsonFormat(json), m)
         let capt = `~ Tebak Hewan\n\n`
         capt += `Apa nama hewan pada gambar ini??\n\n`
         capt += `Timeout : ${timeout / 60 / 1000} menit\n`
         capt += `Balas pesan ini untuk menjawab, kirim ${usedPrefix}nimalclue untuk bantuan\n\n`
         capt += '> ' + global.footer
         conn.tebakhewan[id] = [
            await conn.sendMessage(m.chat, {
               image: { url: json.data.image }, caption: capt
            }, { quoted: m }),
            json,
            poin,
            setTimeout(() => {
               if (conn.tebakhewan[id]) conn.reply(m.chat, `Waktu habis!\nJawabannya adalah *${json.data.title}*`, conn.tebakhewan[id][0])
               delete conn.tebakhewan[id]
            }, timeout)
         ]
      } else if (command == 'nimalclue') {
         if (!(id in conn.tebakhewan)) throw false
         let clue = conn.tebakhewan[id][1].data.title.replace(/[AIUEOaiueo]/g, '_')
         conn.reply(m.chat, '```' + clue + '```', m)
      }
   },
   group: true,
   game: true,
   limit: true
}