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
         if (!text) return conn.reply(m.chat, Func.example(usedPrefix, command, 'Kucing'), m)
         m.react('🕒')
         let json = await Api.get('api/pinterest', {
            q: text
         })
         if (!json.status) return m.reply(Func.jsonFormat(json))
         let old = new Date()
         for (let i = 0; i < 3; i++) {
            var rand = Math.floor(json.data.length * Math.random())
            conn.sendFile(m.chat, json.data[rand].url, '', `Process : ${((new Date - old) * 1)} ms`, m)
         }
      } catch (e) {
         return conn.reply(m.chat, Func.jsonFormat(e), m)
      }
   },
   limit: true,
}