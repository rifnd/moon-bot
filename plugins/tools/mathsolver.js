module.exports = {
   help: ['mathsolver'],
   use: 'query',
   tags: ['tools'],
   command: /^(mathsolver)$/i,
   run: async (m, {
      conn,
      usedPrefix,
      command,
      text,
      Scraper,
      Func
   }) => {
      try {
         if (!text) return m.reply(Func.example(usedPrefix, command, '1 + 1'))
         m.react('🕒')
         const json = await Api.get('api/ai-mathsolver', {
            q: text
         })
         if (!json.status) return m.reply(Func.jsonFormat(json))
         m.reply(json.data.answer)
      } catch (e) {
         console.log(e)
         return m.reply(Func.jsonFormat(e))
      }
   },
   premium: true,
}