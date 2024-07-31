module.exports = {
   run: async (m, {
      conn,
      usedPrefix,
      command,
      text,
      Scraper,
      Func
   }) => {
      try {
         if (!text) return conn.reply(m.chat, Func.example(usedPrefix, command, 'Surabaya'), m)
         m.react('🕒')
         const json = await Api.get('api/jadwalsholat', { q: text })
         if (!json.status) return conn.reply(m.chat, Func.jsonFormat(json), m)
         let teks = '乂  *J A D W A L S H A L A T*\n\n'
         teks += '  ◦  *Tanggal* : ' + json.data.tgl + '\n'
         teks += '  ◦  *Imsyak* : ' + json.data.imsyak + '\n'
         teks += '  ◦  *Subuh* : ' + json.data.subuh + '\n'
         teks += '  ◦  *Terbit* : ' + json.data.terbit + '\n'
         teks += '  ◦  *Dzuhur* : ' + json.data.dzuhur + '\n'
         teks += '  ◦  *Asar* : ' + json.data.ashr + '\n'
         teks += '  ◦  *Maghrib* : ' + json.data.maghrib + '\n'
         teks += '  ◦  *Isya* : ' + json.data.isya + '\n\n'
         teks += json.data.parameter
         m.reply(teks)
      } catch (e) {
         console.log(e)
         return conn.reply(m.chat, Func.jsonFormat(e), m)
      }
   },
   help: ['jadwalshalat'],
   use: 'city',
   tags: ['tools'],
   command: /^(jadwal?((sha|sho)lat))$/i,
   limit: true,
}