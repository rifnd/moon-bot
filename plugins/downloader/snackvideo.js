module.exports = {
   help: ['snackvideo'],
   use: 'link',
   tags: ['downloader'],
   command: /^(snackvideo)$/i,
   run: async (m, {
      conn,
      usedPrefix,
      command,
      args,
      Func
   }) => {
      try {
         if (!args[0]) return conn.reply(m.chat, Func.example(usedPrefix, command, 'https://sck.io/p/jiv-dwZX'), m)
         if (!args[0].match('sck.io')) return conn.reply(m.chat, global.status.invalid, m)
         m.react('🕒')
         var json = await Api.get('api/snackvideo', {
            url: args[0]
         })
         if (!json.status) return m.reply(Func.jsonFormat(json))
         conn.sendFile(m.chat, json.data.url, Func.filename('mp4'), '', m)
      } catch (e) {
         console.log(e)
         return m.reply(Func.jsonFormat(e))
      }
   },
   limit: true
}