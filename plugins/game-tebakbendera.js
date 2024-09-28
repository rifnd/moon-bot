module.exports = {
   help: ['tebakbendera'],
   tags: ['game'],
   command: /^(tebakbendera|tekbe)$/i,
   run: async (m, {
      conn,
      usedPrefix,
      command,
      Func
   }) => {
      conn.tebakbendera = conn.tebakbendera ? conn.tebakbendera : {}
      let id = m.chat
      let timeout = 120000
      let poin = Func.randomInt('1000', '50000')
      if (command == 'tebakbendera') {
         if (id in conn.tebakbendera) return conn.reply(m.chat, 'Masih ada soal belum terjawab di chat ini', conn.tebakbendera[id][0])
         const src = await Func.fetchJson('https://raw.githubusercontent.com/qisyana/scrape/main/flag.json')
         let json = src[Math.floor(Math.random() * src.length)]
         let capt = `乂  *T E B A K - B E N D E R A*\n\n`
         capt += `Gambar ini bendera negara mana??\n\n`
         capt += `Timeout : ${timeout / 60 / 1000} menit\n`
         capt += `Balas pesan ini untuk menjawab, kirim ${usedPrefix}tekbe untuk bantuan`
         conn.tebakbendera[id] = [
            await conn.sendMessage(m.chat, {
               image: { url: json.img }, caption: capt
            }, { quoted: m }),
            json,
            poin,
            setTimeout(() => {
               if (conn.tebakbendera[id]) conn.reply(m.chat, `Waktu habis!\nJawabannya adalah *${json.name}*`, conn.tebakbendera[id][0])
               delete conn.tebakbendera[id]
            }, timeout)
         ]
      } else if (command == 'tekbe') {
         if (!(id in conn.tebakbendera)) throw false
         let clue = conn.tebakbendera[id][1].name.replace(/[AIUEOaiueo]/g, '_')
         conn.reply(m.chat, '```' + clue + '```\nBalas soalnya, bukan pesan ini', conn.tebakbendera[id][0])
      }
   },
   group: true,
   game: true,
   limit: true
}