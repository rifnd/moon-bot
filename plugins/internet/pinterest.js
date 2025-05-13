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
               url: json.data[rand].url
            })
         }
         conn.sendAlbumMessage(m.chat, medias, m)
      } catch (e) {
         return conn.reply(m.chat, Func.jsonFormat(e), m)
      }
   },
   limit: true
}