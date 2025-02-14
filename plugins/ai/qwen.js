module.exports = {
   help: ['qwen'],
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
         var result = await Api.get('api/qwen', {
            msg: text,
            model: 'qwen-max-latest',
            realtime: true
         })
         if (!result.status) return conn.reply(m.chat, `🚩 ${json.msg}`, m)
         conn.reply(m.chat, result.data.choices[0].message.content, m)
      } catch (e) {
         return conn.reply(m.chat, Func.jsonFormat(e), m)
      }
   },
   limit: true,
}