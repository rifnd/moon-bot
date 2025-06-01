module.exports = {
   help: ['facebook'],
   command: ['fb'],
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
         if (!args[0]) return m.reply(Func.example(usedPrefix, command, 'https://www.facebook.com/share/r/1WCkXg8fsT/'))
         if (!args[0].match(/(?:https?:\/\/(web\.|www\.|m\.)?(facebook|fb)\.(com|watch)\S+)?$/)) return m.reply(status.invalid)
         m.react('🕒')
         let json = await Api.get('api/fb', {
            url: args[0]
         })
         if (!json.status) return conn.reply(m.chat, `🚩 ${json.msg}`, m)
         let result = json.data.find(v => v.quality == 'HD') || json.data.find(v => v.quality == 'SD')
         if (result) {
            conn.sendFile(m.chat, result.url, Func.filename(result.quality === 'jpeg' ? 'jpeg' : 'mp4'), `◦ *Quality* : ${result.quality}`, m)
         } else {
            json.data.map(async v => {
               await conn.sendFile(m.chat, v.url, Func.filename(v.quality === 'jpeg' ? 'jpeg' : 'mp4'), `◦ *Quality* : ${v.quality}`, m)
               await Func.delay(1500)
            })
         }
      } catch (e) {
         return conn.reply(m.chat, Func.jsonFormat(e), m)
      }
   },
   error: false,
   limit: true
}