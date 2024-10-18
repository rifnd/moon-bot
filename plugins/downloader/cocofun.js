module.exports = {
   help: ['cocofun'],
   use: 'link',
   tags: ['downloader'],
   command: /^(cocofun)$/i,
   run: async (m, {
      conn,
      usedPrefix,
      command,
      args,
      Func
   }) => {
      try {
         if (!args[0]) return conn.reply(m.chat, Func.example(usedPrefix, command, 'https://www.icocofun.com/share/post/457616496291?lang=id&pkg=id&share_to=copy_link&m=c6d95b35bbbbf91ce3da574262388117&d=f7445b'), m)
         if (!args[0].match('icocofun.com')) return conn.reply(m.chat, global.status.invalid, m)
         m.react('🕒')
         var json = await Api.get('api/cocofun', {
            url: args[0]
         })
         if (!json.status) return m.reply(Func.jsonFormat(json))
         conn.sendFile(m.chat, json.data.url, Func.filename('mp4'), `◦ *Title* : ${json.data.title}\n◦ *Description* : ${json.data.desc}`, m)
      } catch (e) {
         console.log(e)
         return m.reply(Func.jsonFormat(e))
      }
   },
   limit: true
}