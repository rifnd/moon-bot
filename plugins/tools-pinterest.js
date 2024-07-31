module.exports = {
   run: async (m, {
      conn,
      usedPrefix,
      command,
      text,
      Scraper,
      Func
   }) => {
      if (!text) return m.reply(Func.texted(usedPrefix, command, 'Kucing'))
      try {
         let json = await Api.get('api/pinterest', {
            q: text
         })
         if (!json.status) return m.reply(Func.jsonFormat(e))
         m.react('🕐')
         let old = new Date()
         for (let i = 0; i < 3; i++) {
            var rand = Math.floor(json.data.length * Math.random())
            conn.sendFile(m.chat, json.data[rand].url, '', `🍟 *Fetching* : ${((new Date - old) * 1)} ms`, m)
         }
      } catch (e) {
         console.log(e)
         return m.reply(status.error)
      }
   },
   help: ['pin'],
   use: 'query',
   tags: ['tools'],
   command: /^(pin|pinterest)$/i,
   limit: true,
}