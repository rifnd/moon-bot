module.exports = {
   help: ['kbbg'],
   use: 'text',
   tags: ['internet'],
   command: /^(kbbg)$/i,
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
   limit: true,
}