module.exports = {
   help: ['sticker'],
   command: ['s'],
   use: 'query / reply media',
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
         if (m.quoted ? m.quoted.message : m.msg.viewOnce) {
            let type = m.quoted ? Object.keys(m.quoted.message)[0] : m.mtype
            let q = m.quoted ? m.quoted.message[type] : m.msg
            let img = await conn.downloadMediaMessage(q)
            if (/video/.test(type)) {
               if (q.seconds > 10) return conn.reply(m.chat, Func.texted('bold', `🚩 Maximum video duration is 10 seconds.`), m)
               return await conn.sendSticker(m.chat, img, m, {
                  packname: exif.sk_pack,
                  author: exif.sk_author
               })
            } else if (/image/.test(type)) {
               return await conn.sendSticker(m.chat, img, m, {
                  packname: exif.sk_pack,
                  author: exif.sk_author
               })
            }
         } else {
            let q = m.quoted ? m.quoted : m
            let mime = (q.msg || q).mimetype || ''
            if (/image\/(jpe?g|png)/.test(mime)) {
               let img = await q.download()
               if (!img) return conn.reply(m.chat, global.status.wrong, m)
               return await conn.sendSticker(m.chat, img, m, {
                  packname: exif.sk_pack,
                  author: exif.sk_author
               })
            } else if (/video/.test(mime)) {
               if ((q.msg || q).seconds > 10) return conn.reply(m.chat, Func.texted('bold', `🚩 Maximum video duration is 10 seconds.`), m)
               let img = await q.download()
               if (!img) return conn.reply(m.chat, global.status.wrong, m)
               return await conn.sendSticker(m.chat, img, m, {
                  packname: exif.sk_pack,
                  author: exif.sk_author
               })
            } else conn.reply(m.chat, Func.texted('bold', `🚩 Send or reply to the image you want to make into a sticker.`), m)
         }
      } catch (e) {
         return conn.reply(m.chat, Func.jsonFormat(e), m)
      }
   },
   limit: true
}