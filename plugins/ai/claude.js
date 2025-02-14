module.exports = {
   help: ['claude'],
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
         if (!text) return conn.reply(m.chat, Func.example(usedPrefix, command, 'mark itu orang atau alien'), m)
         m.react('🕒')
         var result = await Api.get('api/duckduckgo', {
            msg: text,
            model: 'claude-3-haiku-20240307'
         })
         if (!result.status) return conn.reply(m.chat, `🚩 ${json.msg}`, m)
         conn.reply(m.chat, result.data.content, m)
      } catch (e) {
         return conn.reply(m.chat, Func.jsonFormat(e), m)
      }
   },
   limit: true,
}