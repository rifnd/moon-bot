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
         if (!text) return m.reply(Func.example(usedPrefix, command, 'alay'))
         m.react('🕐')
         const json = await Api.get('api/kbbg', { q: text })
         if (!json.status) return m.reply(Func.jsonFormat(json))
         m.reply(json.data.description)
      } catch (e) {
         console.log(e)
      }
   },
   help: ['kbbg'],
   use: 'text',
   tags: ['tools'],
   command: /^(kbbg)$/i,
   limit: true,
}