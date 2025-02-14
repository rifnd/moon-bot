module.exports = {
   help: ['brat'],
   use: 'text',
   tags: ['converter'],
   run: async (m, {
      conn,
      usedPrefix,
      command,
      text,
      setting,
      Func
   }) => {
      try {
         const args = text.trim().split(' ')
         const mode = args[0] === 'gif' ? 'gif' : 'text'
         const content = mode === 'gif' ? args.slice(1).join(' ') : text.trim()
         if (!content) return conn.reply(m.chat, Func.example(usedPrefix, command, 'moon-bot'), m)
         if (content.length > 100) return conn.reply(m.chat, Func.texted('bold', '🚩 Text is too long, max 100 characters.'), m)
         m.react('🕒')
         if (mode === 'gif') {
            let json = await Api.get('api/bratgif', {
               text: content
            })
            conn.sendSticker(m.chat, json.data.url, m, {
               packname: m.pushName,
               author: setting.sk_author
            })
         } else {
            let json = await Api.get('api/brat', {
               text: content
            })
            conn.sendSticker(m.chat, json.data.url, m, {
               packname: m.pushName,
               author: setting.sk_author
            })
         }
      } catch (e) {
         return conn.reply(m.chat, Func.jsonFormat(e), m)
      }
   },
   limit: true
}