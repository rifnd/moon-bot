module.exports = {
   run: async (m, {
      conn,
      usedPrefix,
      command,
      args,
      Func
   }) => {
      try {
         if (!args[0]) return m.reply(Func.example(usedPrefix, command, 'https://twitter.com/gofoodindonesia/status/1229369819511709697'))
         if (!args[0].match(/(https?:\/\/)?(www\.)?twitter|x\.com\/(?:#!\/)?([a-zA-Z0-9_]+)\/status(es)?\/(\d+)$/)) return conn.reply(m.chat, global.status.invalid, m)
         let old = new Date()
         m.react('🕒')
         var json = await Api.get('api/twitter', {
            url: args[0]
         })
         if (!json.status) return m.reply(Func.jsonFormat(json))
         let url = json.data.find((v) => v.url).url
         await conn.sendFile(m.chat, url, '', `🍟 *Fetching* : ${((new Date - old) * 1)} ms`, m)
      } catch (e) {
         console.log(e)
         return m.reply(Func.jsonFormat(e))
      }
   },
   help: ['twitter'],
   use: 'link',
   tags: ['downloader'],
   command: /^(twitter|twit)$/i,
   limit: true
}