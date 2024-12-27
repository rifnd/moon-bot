module.exports = {
   help: ['ss', 'ssweb'],
   use: 'link',
   tags: ['tools'],
   run: async (m, {
      conn,
      usedPrefix,
      command,
      args,
      Func
   }) => {
      try {
         if (!args[0]) return m.reply(Func.example(usedPrefix, command, 'https://api.alyachan.dev'))
         if (!/^https?:\/\//.test(args[0])) return m.reply('Prefix links with https://')
         let old = new Date()
         switch (command) {
            case 'ss':
            case 'screenshot': {
               m.react('🕒')
               const json = await Api.get('api/ssweb', {
                  url: args[0], mode: 'mobile'
               })
               if (!json.status) return m.reply(Func.jsonFormat(json))
               conn.sendFile(m.chat, json.data.url, '', `🍟 *Process* : ${((new Date - old) * 1)} ms`, m)
            }
            break
            case 'ssweb': {
               m.react('🕒')
               const json = await Api.get('api/ssweb', {
                  url: args[0], mode: 'desktop'
               })
               if (!json.status) return m.reply(Func.jsonFormat(json))
               conn.sendFile(m.chat, json.data.url, '', `🍟 *Process* : ${((new Date - old) * 1)} ms`, m)
            }
            break
         }
      } catch (e) {
         return conn.reply(m.chat, Func.jsonFormat(e), m)
      }
   },
   limit: true
}