module.exports = {
   help: ['promptgen'],
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
         if (!text) return conn.reply(m.chat, Func.example(usedPrefix, command, 'white cat'), m)
         m.react('🕒')
         var result = await Api.get('api/prompt-generator', {
            q: text
         })
         if (!result.status) return conn.reply(m.chat, `🚩 ${json.msg}`, m)
         conn.reply(m.chat, result.data[0].content.parts[0].text, m)
      } catch (e) {
         return conn.reply(m.chat, Func.jsonFormat(e), m)
      }
   },
   limit: true,
}