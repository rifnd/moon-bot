module.exports = {
   help: ['lengkapikalimat'],
   tags: ['game'],
   command: /^(lengkapikalimat|leka)$/i,
   run: async (m, {
      conn,
      usedPrefix,
      command,
      Func
   }) => {
      conn.lengkapikalimat = conn.lengkapikalimat ? conn.lengkapikalimat : {}
      let id = m.chat
      let timeout = 120000
      let poin = Func.randomInt('1000', '50000')
      if (command == 'lengkapikalimat') {
         if (id in conn.lengkapikalimat) return conn.reply(m.chat, Func.texted('bold', '^ Soal ini belum dijawab.'), conn.lengkapikalimat[id][0])
         let src = await Func.fetchJson('https://raw.githubusercontent.com/qisyana/scrape/main/lengkapikalimat.json')
         let json = src[Math.floor(Math.random() * src.length)]
         let capt = `~ Lengkapi Kalimat\n\n`
         capt += `${json.pertanyaan}\n\n`
         capt += `Timeout : ${timeout / 60 / 1000} menit\n`
         capt += `Balas pesan ini untuk menjawab, kirim ${usedPrefix}leka untuk bantuan\n\n`
         capt += '> ' + global.footer
         conn.lengkapikalimat[id] = [
            await conn.reply(m.chat, capt, m),
            json,
            poin,
            setTimeout(() => {
               if (conn.lengkapikalimat[id]) conn.reply(m.chat, `Waktu habis!\nJawabannya adalah *${json.jawaban}*`, conn.lengkapikalimat[id][0])
               delete conn.lengkapikalimat[id]
            }, timeout)
         ]
      } else if (command == 'leka') {
         conn.lengkapikalimat = conn.lengkapikalimat ? conn.lengkapikalimat : {}
         if (!(id in conn.lengkapikalimat)) throw false
         let clue = conn.lengkapikalimat[id][1].jawaban.trim().replace(/[AIUEOaiueo]/g, '_')
         conn.reply(m.chat, '```' + clue + '```', m)
      }
   },
   group: true,
   game: true,
   limit: true
}