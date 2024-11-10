module.exports = {
   run: async (m, {
      conn,
      usedPrefix,
      command,
      args,
      Func
   }) => {
      try {
         if (!args[0]) return m.reply(Func.example(usedPrefix, command, 'https://api.alyachan.pro'))
         if (!/^https?:\/\//.test(args[0])) return m.reply('Prefix links with https://')
         switch (command) {
            case 'ss':
            case 'screenshot': {
               m.react('🕒')
               const json = await Api.get('api/ssweb', {
                  url: args[0], mode: 'mobile'
               })
               if (!json.status) return m.reply(Func.jsonFormat(json))
               conn.sendFile(m.chat, json.data.url, '', '', m)
            }
            break
            case 'ssweb': {
               m.react('🕒')
               const json = await Api.get('api/ssweb', {
                  url: args[0], mode: 'desktop'
               })
               if (!json.status) return m.reply(Func.jsonFormat(json))
               conn.sendFile(m.chat, json.data.url, '', '', m)
            }
            break
         }
      } catch (e) {
         m.reply(Func.jsonFormat(e))
      }
   },
   help: ['ss', 'ssweb'],
   use: 'link',
   tags: ['tools'],
   command: /^(ss|screenshot|ssweb)$/i,
   limit: true
}