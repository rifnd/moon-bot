module.exports = {
   async before(m, { conn, users, isPrems, setting, Func }) {
      try {
         if (setting.autodownload && isPrems) {
            const regex = /https?:\/\/(www\.|web\.|m\.)?(facebook|fb)\.(com|watch)\S*/g
            const links = m.text.match(regex)
            if (links && links.length > 0) {
               const limitCost = 1
               if (users.limit < limitCost) {
                  return conn.reply(m.chat, Func.texted('bold', '🚩 Your limit is not enough to use this feature'), m)
               }
               users.limit -= limitCost
               m.react('🕒')
               for (const link of links) {
                  try {
                     let json = await Api.get('api/fb', { url: link })
                     if (!json.status) {
                        conn.reply(m.chat, Func.jsonFormat(json), m)
                        continue
                     }
                     let result = json.data.find(v => v.quality === 'HD') || json.data.find(v => v.quality === 'SD')
                     if (result) {
                        await conn.sendFile(m.chat, result.url, Func.filename('mp4'), `◦ *Quality* : ${result.quality}`, m)
                     }
                  } catch (e) {
                     conn.reply(m.chat, Func.jsonFormat(e), m)
                  }
               }
            }
         }
      } catch (e) {
         conn.reply(m.chat, Func.jsonFormat(e), m)
      }
      return !0
   }
}