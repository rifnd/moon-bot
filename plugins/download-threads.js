module.exports = {
   run: async (m, {
      conn,
      usedPrefix,
      command,
      args,
      Func
   }) => {
      try {
         if (!args[0]) return m.reply(Func.example(usedPrefix, command, 'https://www.threads.net/t/CuiXbGvPyJz/?igshid=NTc4MTIwNjQ2YQ=='))
         if (!args[0].match('threads.net')) return conn.reply(m.chat, global.status.invalid, m)
         let old = new Date()
         m.react('🕒')
         var json = await Api.get('api/threads', {
            url: args[0]
         })
         if (!json.status) return m.reply(Func.jsonFormat(json))
         for (let i of json.data) {
            conn.sendFile(m.chat, i.url, '', `🍟 *Fetching* : ${((new Date - old) * 1)} ms`, m)
         }
      } catch (e) {
         console.log(e)
         return m.reply(Func.jsonFormat(e))
      }
   },
   help: ['threads'],
   use: 'link',
   tags: ['downloader'],
   command: /^(threads)$/i,
   limit: true
}