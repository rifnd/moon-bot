module.exports = {
   help: ['susunkata'],
   tags: ['game'],
   command: /^(susunkata|suska)$/i,
   run: async (m, {
      conn,
      usedPrefix,
      command,
      Func
   }) => {
      conn.susunkata = conn.susunkata ? conn.susunkata : {}
      let id = m.chat
      let timeout = 120000
      let poin = Func.randomInt('1000', '50000')
      if (command == 'susunkata') {
         if (id in conn.susunkata) return conn.reply(m.chat, 'Masih ada soal belum terjawab di chat ini', conn.susunkata[id][0])
         let src = await Func.fetchJson('https://raw.githubusercontent.com/BochilTeam/database/master/games/susunkata.json')
         let json = src[Math.floor(Math.random() * src.length)]
         let capt = `~ Susun Kata\n\n`
         capt += `${json.soal}\n\n`
         capt += `Tipe : ${json.tipe}\n`
         capt += `Timeout : ${timeout / 60 / 1000} menit\n`
         capt += `Balas pesan ini untuk menjawab, kirim ${usedPrefix}suska untuk bantuan\n\n`
         capt += '> ' + global.footer
         conn.susunkata[id] = [
            await conn.reply(m.chat, capt, m),
            json,
            poin,
            setTimeout(() => {
               if (conn.susunkata[id]) conn.reply(m.chat, `Waktu habis!\nJawabannya adalah *${json.jawaban}*`, conn.susunkata[id][0])
               delete conn.susunkata[id]
            }, timeout)
         ]
      } else if (command == 'suska') {
         if (!(id in conn.susunkata)) throw false
         let clue = conn.susunkata[id][1].jawaban.replace(/[AIUEOaiueo]/g, '_')
         conn.reply(m.chat, '```' + clue + '```', m)
      }
   },
   group: true,
   game: true,
   limit: true
}