module.exports = {
   help: ['brat'],
   use: 'text',
   tags: ['converter'],
   command: /^(brat)$/,
   run: async (m, {
      conn,
      usedPrefix,
      command,
      text,
      setting,
      Func
   }) => {
      try {
         if (!text) return conn.reply(m.chat, Func.example(usedPrefix, command, 'moon-bot'), m)
         if (text.length > 50) return client.reply(m.chat, Func.texted('bold', `🚩 Max 50 character.`), m)
         m.react('🕒')
         let json = await Api.get('api/brat', {
            text
         })
         if (!json.status) return conn.reply(m.chat, Func.texted('bold', `🚩 Can't convert text to sticker.`), m)
         conn.sendSticker(m.chat, json.data.url, m, {
            packname: setting.sk_pack,
            author: setting.sk_author
         })
      } catch (e) {
         return conn.reply(m.chat, Func.jsonFormat(e), m)
      }
   },
   limit: true
}