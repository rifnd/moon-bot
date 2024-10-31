module.exports = {
   help: ['emoji'],
   use: 'emoji',
   tags: ['converter'],
   command: /^(emoji|semoji)$/,
   run: async (m, {
      conn,
      usedPrefix,
      command,
      text,
      setting,
      Func
   }) => {
      try {
         if (!text) return conn.reply(m.chat, Func.example(usedPrefix, command, '😀'), m)
         m.react('🕒')
         let json = await Api.get('api/emoji', {
            emo: text
         })
         if (!json.status) return conn.reply(m.chat, Func.jsonFormat(json), m)
         conn.sendSticker(m.chat, await Func.fetchBuffer(json.data.whatsapp), m, {
            packname: setting.sk_pack,
            author: setting.sk_author
         })
      } catch (e) {
         console.log(e)
         return conn.reply(m.chat, Func.jsonFormat(e), m)
      }
   },
   limit: true,
   location: __filename
}