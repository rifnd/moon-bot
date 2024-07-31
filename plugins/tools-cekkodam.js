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
         if (!text) return m.reply(Func.example(usedPrefix, command, 'moon'))
         m.react('🕒')
         var result = await Api.get('api/check-khodam', {
            name: text
         })
         if (!result.status) return m.reply(Func.jsonFormat(result))
         conn.reply(m.chat, result.data.content, m)
      } catch (e) {
         console.log(e)
         return conn.reply(m.chat, Func.jsonFormat(e), m)
      }
   },
   help: ['cekkodam'],
   use: 'name',
   tags: ['tools'],
   command: /^(cekkodam)$/i,
   limit: true,
}