module.exports = {
   help: ['tekateki'],
   tags: ['game'],
   command: /^(tekateki|tekki)$/i,
   run: async (m, {
      conn,
      usedPrefix,
      command,
      Func
   }) => {
      conn.tekateki = conn.tekateki ? conn.tekateki : {}
      let id = m.chat
      let timeout = 120000
      let poin = Func.randomInt('1000', '50000')
      if (command == 'tekateki') {
         if (id in conn.tekateki) return conn.reply(m.chat, 'Masih ada soal belum terjawab di chat ini', conn.tekateki[id][0])
         let src = await Func.fetchJson('https://raw.githubusercontent.com/qisyana/scrape/main/tekateki.json')
         let json = src[Math.floor(Math.random() * src.length)]
         let capt = `~ Teka Teki\n\n`
         capt += `${json.pertanyaan}\n\n`
         capt += `Timeout : ${timeout / 60 / 1000} menit\n`
         capt += `Balas pesan ini untuk menjawab, kirim ${usedPrefix}tekki untuk bantuan\n\n`
         capt += `> ` + global.footer
         conn.tekateki[id] = [
            await conn.reply(m.chat, capt, m),
            json,
            poin,
            setTimeout(() => {
               if (conn.tekateki[id]) conn.reply(m.chat, `Waktu habis!\nJawabannya adalah *${json.jawaban}*`, conn.tekateki[id][0])
               delete conn.tekateki[id]
            }, timeout)
         ]
      } else if (command == 'tekki') {
         if (!(id in conn.tekateki)) throw false
         let clue = conn.tekateki[id][1].jawaban.replace(/[AIUEOaiueo]/g, '_')
         conn.reply(m.chat, '```' + clue + '```', m)
      }
   },
   group: true,
   game: true,
   limit: true
}