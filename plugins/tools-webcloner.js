module.exports = {
   run: async (m, {
      conn,
      usedPrefix,
      command,
      args,
      Func
   }) => {
      try {
         if (!args[0]) return conn.reply(m.chat, Func.example(usedPrefix, command, 'https://google.com'), m)
         if (!/^https?:\/\//.test(args[0])) return conn.reply(m.chat, global.status.invalid, m)
         m.react('🕒')
         const json = await Api.get('api/web-cloner', {
            url: args[0]
         })
         if (!json.status) return m.reply(Func.jsonFormat(json))
         conn.sendFile(m.chat, json.data.url, '', '', m)
      } catch (e) {
         console.log(e)
         return m.reply(Func.jsonFormat(e))
      }
   },
   help: ['webclone'],
   use: 'link',
   tags: ['tools'],
   command: /^(webclone)$/i,
   premium: true,
}