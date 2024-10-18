module.exports = {
   help: ['ttp'],
   use: 'text',
   tags: ['converter'],
   command: /^(ttp)$/i,
   run: async (m, {
      conn,
      usedPrefix,
      command,
      text,
      Func
   }) => {
      try {
         let exif = global.db.data.setting
         if (!text) return conn.reply(m.chat, Func.example(usedPrefix, command, 'moon bot'), m)
         if (text.length > 10) return conn.reply(m.chat, Func.texted('bold', '🚩 Max 10 character'), m)
         m.react('🕒')
         let json = await Api.get('api/ttp', {
            text: text
         })
         if (!json.status) return conn.reply(m.chat, Func.jsonFormat(json), m)
         conn.sendSticker(m.chat, json.data.url, m, {
            packname: exif.sk_pack,
            author: exif.sk_author
         })
      } catch (e) {
         console.log(e)
      }
   },
   limit: true
}