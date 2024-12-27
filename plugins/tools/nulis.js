module.exports = {
   help: ['nulis'],
   command: ['magernulis'],
   use: 'text',
   tags: ['tools'],
   run: async (m, {
      conn,
      usedPrefix,
      command,
      text,
      Scraper,
      Func
   }) => {
      try {
         if (!text) return conn.reply(m.chat, Func.example(usedPrefix, command, 'moon-bot'), m)
         m.react('🕒')
         const json = await Api.get('api/nulis', {
            text
         })
         if (!json.status) return m.reply(Func.jsonFormat(json))
         conn.sendFile(m.chat, json.data.url, '', ``, m)
      } catch (e) {
         return conn.reply(m.chat, Func.jsonFormat(e), m)
      }
   },
   limit: true,
}