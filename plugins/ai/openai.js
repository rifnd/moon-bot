module.exports = {
   help: ['openai'],
   command: ['ai'],
   use: 'query',
   tags: ['ai'],
   run: async (m, {
      conn,
      usedPrefix,
      command,
      text,
      Scraper,
      Func
   }) => {
      try {
         if (!text) return m.reply(Func.example(usedPrefix, command, 'moonbot'))
         m.react('🕒')
         var result = await Api.get('api/openai', {
            prompt: text
         })
         if (!result.status) return m.reply(Func.jsonFormat(result))
         conn.reply(m.chat, result.data.content, m)
      } catch (e) {
         return conn.reply(m.chat, Func.jsonFormat(e), m)
      }
   },
   limit: true,
}
