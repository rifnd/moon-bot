module.exports = {
   run: async (m, {
      conn,
      usedPrefix,
      command,
      args,
      Func
   }) => {
      try {
         if (!args[0]) return m.reply(Func.example(usedPrefix, command, 'https://www.facebook.com/MotoPinas/videos/405056490108354/?app=fbl'))
         if (!args[0].match(/(?:https?:\/\/(web\.|www\.|m\.)?(facebook|fb)\.(com|watch)\S+)?$/)) return m.reply(status.invalid)
         m.react('🕒')
         var json = await Api.get('api/fb', {
            url: args[0]
         })
         if (!json.status) return m.reply(Func.jsonFormat(json))
         let result = json.data.find(v => v.quality == 'HD') || json.data.find(v => v.quality == 'SD')
         conn.sendFile(m.chat, result.url, Func.filename('mp4'), `◦ *Quality* : ${result.quality}`, m)
      } catch (e) {
         console.log(e)
         return m.reply(Func.jsonFormat(e))
      }
   },
   help: ['fb'],
   use: 'link',
   tags: ['downloader'],
   command: /^(fb|facebook)$/i,
   limit: true
}