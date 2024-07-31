module.exports = {
   run: async (m, {
      conn,
      usedPrefix,
      command,
      args,
      Func
   }) => {
      try {
         if (!args[0]) return conn.reply(m.chat, Func.example(usedPrefix, command, 'https://l.likee.video/v/MmMNz4'), m)
         if (!args[0].match('likee.video')) return conn.reply(m.chat, global.status.invalid, m)
         m.react('🕒')
         var json = await Api.get('api/likee', {
            url: args[0]
         })
         if (!json.status) return m.reply(Func.jsonFormat(json))
         if (command == 'likee') {
            conn.sendFile(m.chat, json.data.no_watermark, '', `◦ *Title* : ${json.data.title}`, m)
         } else if (command == 'likeewm') {
            conn.sendFile(m.chat, json.data.watermark, '', `◦ *Title* : ${json.data.title}`, m)
         }
      } catch (e) {
         console.log(e)
         return m.reply(Func.jsonFormat(e))
      }
   },
   help: ['likee', 'likeewm'],
   use: 'link',
   tags: ['downloader'],
   command: /^(likee|likeewm)$/i,
   limit: true
}