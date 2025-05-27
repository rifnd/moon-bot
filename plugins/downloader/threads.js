module.exports = {
   help: ['threads'],
   use: 'link',
   tags: ['downloader'],
   run: async (m, {
      conn,
      usedPrefix,
      command,
      args,
      Func
   }) => {
      try {
         if (!args[0]) return m.reply(Func.example(usedPrefix, command, 'https://www.threads.net/t/CuiXbGvPyJz/?igshid=NTc4MTIwNjQ2YQ=='))
         if (!/https?:\/\/(?:www\.)?(threads\.(net|com)|[\w-]+\.com)\/[^\s"]*/i.test(args[0])) return conn.reply(m.chat, global.status.invalid, m)
         let old = new Date()
         m.react('🕒')
         var json = await Api.get('api/threads', {
            url: args[0]
         })
         if (!json.status) return m.reply(Func.jsonFormat(json))
         for (let i of json.data) {
            conn.sendFile(m.chat, i.url, '', `🍟 *Process* : ${((new Date - old) * 1)} ms`, m)
         }
      } catch (e) {
         return conn.reply(m.chat, Func.jsonFormat(e), m)
      }
   },
   limit: true
}