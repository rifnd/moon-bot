module.exports = {
   help: ['openai'],
   command: ['ai'],
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
         if (!text) return m.reply(Func.example(usedPrefix, command, 'moonbot'))
         m.react('🕒')
         var result = await Api.get('api/gpt-3.5-turbo', {
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
