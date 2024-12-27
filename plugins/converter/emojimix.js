module.exports = {
   help: ['emojimix'],
   use: 'emoji + emoji',
   tags: ['converter'],
   run: async (m, {
      conn,
      usedPrefix,
      command,
      text,
      Func
   }) => {
      try {
         let exif = global.db.setting
         if (!text) return conn.reply(m.chat, Func.example(usedPrefix, command, '😳+😩'), m)
         m.react('🕒')
         let [emo1, emo2] = text.split`+`
         if (!emo1 || !emo2) return conn.reply(m.chat, Func.texted('bold', `🚩 Give 2 emoji to mix.`), m)
         const json = await Api.get('api/emojimix', {
            emo1, emo2
         })
         if (!json.status) return conn.reply(m.chat, Func.texted('bold', `🚩 Emoji can't be mixed.`), m)
         await conn.sendSticker(m.chat, json.data.url, m, {
            packname: exif.sk_pack,
            author: exif.sk_author,
            categories: [emo1, emo2]
         })
      } catch (e) {
         return conn.reply(m.chat, Func.jsonFormat(e), m)
      }
   },
   limit: true
}