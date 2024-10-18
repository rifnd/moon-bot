module.exports = {
   help: ['unshortner'],
   use: 'link',
   command: /^(unshortner|unshort)$/i,
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
         if (!args[0]) return conn.reply(m.chat, Func.example(usedPrefix, command, 'http://gg.gg/1brt6s'), m)
         m.react('🕒')
         let json = await Api.get('api/unshortner', {
            url: args[0]
         })
         if (!json.status) return conn.reply(m.chat, Func.jsonFormat(json), m)
         conn.reply(m.chat, Func.jsonFormat(json.data), m)
      } catch (e) {
         return conn.reply(m.chat, Func.jsonFormat(e), m)
      }
   },
   limit: true
}