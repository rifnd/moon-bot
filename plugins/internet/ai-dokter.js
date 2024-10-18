module.exports = {
   help: ['aidokter'],
   use: 'query',
   tags: ['internet'],
   command: /^(aidokter)$/i,
   run: async (m, {
      conn,
      usedPrefix,
      command,
      text,
      Scraper,
      Func
   }) => {
      try {
         if (!text) return m.reply(Func.example(usedPrefix, command, 'masuk angin'))
         m.react('🕒')
         var result = await Api.get('api/ai-dokter', {
            text: text
         })
         if (!result.status) return m.reply(Func.jsonFormat(json))
         conn.reply(m.chat, result.data.content, m)
      } catch (e) {
         console.log(e)
         return conn.reply(m.chat, Func.jsonFormat(e), m)
      }
   },
   limit: true,
}