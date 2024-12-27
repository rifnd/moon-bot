module.exports = {
   help: ['shortner'],
   command: ['shortlink', 'shorten'],
   use: 'link',
   tags: ['tools'],
   run: async (m, {
      conn,
      usedPrefix,
      command,
      args,
      Scraper,
      Func
   }) => {
      try {
         if (!args[0]) return conn.reply(m.chat, Func.example(usedPrefix, command, 'http://google.com'), m)
         m.react('🕒')
         let json = await Api.get('api/shorten', {
            url: args[0]
         })
         if (!json.status) return conn.reply(m.chat, Func.jsonFormat(json), m)
         conn.reply(m.chat, json.data.url, m)
      } catch (e) {
         return conn.reply(m.chat, Func.jsonFormat(e), m)
      }
   },
   limit: true
}