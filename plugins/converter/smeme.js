module.exports = {
   help: ['smeme'],
   use: 'text | text',
   tags: ['converter'],
   command: /^(smeme)$/i,
   run: async (m, {
      conn,
      usedPrefix,
      command,
      text,
      Scraper,
      Func
   }) => {
      try {
         let exif = global.db.data.setting
         if (!text) return conn.reply(m.chat, Func.example(usedPrefix, command, 'Hi | Dude'), m)
         m.react('🕒')
         let [top, bottom] = text.split`|`
         if (m.quoted ? m.quoted.message : m.msg.viewOnce) {
            let type = m.quoted ? Object.keys(m.quoted.message)[0] : m.mtype
            let q = m.quoted ? m.quoted.message[type] : m.msg
            if (/image/.test(type)) {
               let img = await conn.downloadMediaMessage(q)
               let json = await Scraper.uploader(img)
               let res = `https://api.memegen.link/images/custom/${encodeURIComponent(top ? top : ' ')}/${encodeURIComponent(bottom ? bottom : '')}.png?background=${json.data.url}`
               conn.sendSticker(m.chat, res, m, {
                  packname: exif.sk_pack,
                  author: exif.sk_author
               })
            } else conn.reply(m.chat, Func.texted('bold', `🚩 Only for photo.`), m)
         } else {
            let q = m.quoted ? m.quoted : m
            let mime = (q.msg || q).mimetype || ''
            if (!mime) return conn.reply(m.chat, Func.texted('bold', `🚩 Reply photo.`), m)
            if (!/image\/(jpe?g|png)/.test(mime)) return conn.reply(m.chat, Func.texted('bold', `🚩 Only for photo.`), m)
            let img = await q.download()
            let json = await Scraper.uploader(img)
            let res = `https://api.memegen.link/images/custom/${encodeURIComponent(top ? top : ' ')}/${encodeURIComponent(bottom ? bottom : '')}.png?background=${json.data.url}`
            conn.sendSticker(m.chat, res, m, {
               packname: exif.sk_pack,
               author: exif.sk_author
            })
         }
      } catch (e) {
         return conn.reply(m.chat, Func.jsonFormat(e), m)
      }
   },
   limit: true
}