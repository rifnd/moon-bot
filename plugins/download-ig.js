module.exports = {
   run: async (m, {
      conn,
      usedPrefix,
      command,
      args,
      Func
   }) => {
      try {
         if (!args || !args[0]) return conn.reply(m.chat, Func.example(usedPrefix, command, 'https://www.instagram.com/p/CK0tLXyAzEI'), m)
         if (!args[0].match(/(https:\/\/www.instagram.com)/gi)) return conn.reply(m.chat, global.status.invalid, m)
         let old = new Date()
         m.react('🕒')
         var json = await Api.get('api/ig', {
            url: args[0]
         })
         if (!json.status) return conn.reply(m.chat, Func.jsonFormat(json), m)
         for (let i of json.data) {
            conn.sendFile(m.chat, i.url, i.type == 'video' ? Func.filename('mp4') : Func.filename('jpg'), `🍟 *Processed* : ${((new Date - old) * 1)} ms`, m)
            await Func.delay(1500)
         }
      } catch (e) {
         console.log(e)
         return m.reply(Func.jsonFormat(e))
      }
   },
   help: ['ig'],
   use: 'link',
   tags: ['downloader'],
   command: /^(ig|instagram)$/i,
   limit: true
}