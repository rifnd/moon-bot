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
         const json = await Api.get('api/gempa', {})
         if (!json.status) return m.reply(Func.jsonFormat(json))
         m.react('🕒')
         let teks = `乂  *G E M P A*\n\n`
         teks += `  ◦  *Date* : ${json.data.Tanggal}\n`
         teks += `  ◦  *At* : ${json.data.Jam}\n`
         teks += `  ◦  *Magnitude* : ${json.data.Magnitude}\n`
         teks += `  ◦  *Coordinate* : ${json.data.Coordinates}\n`
         teks += `  ◦  *Latitude* : ${json.data.Lintang}\n`
         teks += `  ◦  *Longitude* : ${json.data.Bujur}\n`
         teks += `  ◦  *Depth* : ${json.data.Kedalaman}\n`
         teks += `  ◦  *Region* : ${json.data.Wilayah}\n`
         teks += `  ◦  *Potential* : ${json.data.Potensi}\n`
         teks += `  ◦  *Sensed* : ${json.data.Dirasakan}\n\n`
         teks += global.footer
         conn.sendFile(m.chat, json.data.Shakemap, '', teks, m)
      } catch (e) {
         console.log(e)
         return m.reply(Func.jsonFormat(e))
      }
   },
   help: ['gempa'],
   tags: ['tools'],
   command: /^(gempa)$/i,
   limit: true,
}