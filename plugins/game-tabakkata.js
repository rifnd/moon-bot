module.exports = {
   run: async (m, {
      conn,
      usedPrefix,
      command,
      Func
   }) => {
      conn.tebakkata = conn.tebakkata ? conn.tebakkata : {}
      let id = m.chat
      let timeout = 120000
      let poin = Func.randomInt('1000', '50000')
      if (command == 'tebakkata') {
         if (id in conn.tebakkata) return conn.reply(m.chat, 'Masih ada soal belum terjawab di chat ini', conn.tebakkata[id][0])
         let src = await Func.fetchJson('https://raw.githubusercontent.com/BochilTeam/database/master/games/tebakkata.json')
         let json = src[Math.floor(Math.random() * src.length)]
         let capt = `– *Tebak Kata*\n\n`
         capt += `${json.soal}\n\n`
         capt += `Timeout : ${timeout / 60 / 1000} menit\n`
         capt += `Balas pesan ini untuk menjawab, kirim ${usedPrefix}teka untuk bantuan`
         conn.tebakkata[id] = [
            await conn.reply(m.chat, capt, m),
            json,
            poin,
            setTimeout(() => {
               if (conn.tebakkata[id]) conn.reply(m.chat, `Waktu habis!\nJawabannya adalah *${json.jawaban}*`, conn.tebakkata[id][0])
               delete conn.tebakkata[id]
            }, timeout)
         ]
      } else if (command == 'teka') {
         if (!(id in conn.tebakkata)) throw false
         let clue = conn.tebakkata[id][1].jawaban.replace(/[AIUEO]/g, '_')
         conn.reply(m.chat, '```' + clue + '```\nBalas soalnya, bukan pesan ini', conn.tebakkata[id][0])
      }
   },
   help: ['tebakkata'],
   tags: ['game'],
   command: /^(tebakkata|teka)$/i,
   group: true,
   game: true,
   limit: true
}