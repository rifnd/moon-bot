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
         if (!text) return m.reply(Func.example(usedPrefix, command, 'moonbot'))
         m.react('🕒')
         var result = await Api.get('api/gpt-3.5-turbo', {
            prompt: text
         })
         if (!result.status) return m.reply(Func.jsonFormat(json))
         conn.reply(m.chat, result.data.content, m)
      } catch (e) {
         console.log(e)
         return conn.reply(m.chat, Func.jsonFormat(e), m)
      }
   },
   help: ['ai'],
   use: 'query',
   tags: ['tools'],
   command: /^(ai|openai)$/i,
   limit: true,
}