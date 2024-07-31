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
         var json = await Api.get('api/gpt4', {
            prompt: text
         })
         if (!json.status) return m.reply(Func.jsonFormat(json))
         conn.reply(m.chat, json.data.content, m)
      } catch (e) {
         console.log(e)
         return conn.reply(m.chat, Func.jsonFormat(e), m)
      }
   },
   help: ['gpt4'],
   use: 'query',
   tags: ['tools'],
   command: /^(gpt4)$/i,
   limit: true,
}