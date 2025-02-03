module.exports = {
   help: ['pin'],
   command: ['pinterest'],
   use: 'query',
   tags: ['internet'],
   run: async (m, {
      conn,
      usedPrefix,
      command,
      text,
      Scraper,
      Func
   }) => {
      try {
         if (!text) return conn.reply(m.chat, Func.example(usedPrefix, command, 'red moon'), m)
         m.react('🕒')
         let json = await Api.get('api/pinterest', {
            q: text
         })
         if (!json.status) return m.reply(Func.jsonFormat(json))
         let old = new Date()
         let medias = []
         for (let i = 0; i < 5; i++) {
            var rand = Math.floor(json.data.length * Math.random())
            medias.push({
               type: 'image',
               data: { url: json.data[rand].url }
            })
         }
         if (medias.length === 1) {
            await conn.sendFile(m.chat, medias[0].data.url, '', `🍟 *Process* : ${((new Date - old) * 1)} ms`, m)
         } else {
            await conn.sendAlbumMessage(m.chat, medias, { caption: `🍟 Process : ${((new Date - old) * 1)} ms`, quoted: m })
         }
      } catch (e) {
         return conn.reply(m.chat, Func.jsonFormat(e), m)
      }
   },
   limit: true
}