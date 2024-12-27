module.exports = {
   help: ['douyin'],
   use: 'link',
   tags: ['downloader'],
   run: async (m, {
      conn,
      usedPrefix,
      command,
      args,
      Func
   }) => {
      if (!args[0]) return m.reply(Func.example(usedPrefix, command, 'https://v.douyin.com/ieWfMQA1/'))
      if (!args[0].match('douyin.com')) return m.reply(status.invalid)
      m.react('🕒')
      let old = new Date()
      try {
         var json = await Api.get('api/douyin', {
            url: args[0]
         })
         if (!json.status) return m.reply(Func.jsonFormat(json))
         let result = json.data.find(v => v.type == 'video')
         if (!result) {
            json.data.map(x => {
               conn.sendFile(m.chat, x.url, Func.filename('jpg'), `🍟 *Process* : ${((new Date - old) * 1)} ms`, m)
            })
         } else {
            conn.sendFile(m.chat, result.url, Func.filename('mp4'), `🍟 *Process* : ${((new Date - old) * 1)} ms`, m)
         }
      } catch (e) {
         return conn.reply(m.chat, Func.jsonFormat(e), m)
      }
   },
   limit: true
}