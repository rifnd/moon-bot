module.exports = {
   async before(m, { conn, users, isPrems, setting, Func }) {
      try {
         if (setting.autodownload && isPrems) {
            const regex = /^(https?:\/\/)?(www\.)?twitter|x\.com\/(?:#!\/)?([a-zA-Z0-9_]+)\/status(es)?\/(\d+)$/;
            const links = m.text.match(regex)
            if (links && links.length > 0) {
               const limitCost = 1
               if (users.limit < limitCost) {
                  return conn.reply(m.chat, Func.texted('bold', '🚩 Your limit is not enough to use this feature'), m)
               }
               users.limit -= limitCost
               m.react('🕒')
               let old = new Date()
               for (const link of links) {
                  try {
                     let json = await Api.get('api/twitter', {
                        url: link
                     })
                     if (!json.status) return conn.reply(m.chat, Func.jsonFormat(json), m)
                     let url = json.data.find((v) => v.url).url
                     await conn.sendFile(m.chat, url, '', `🍟 *Process* : ${((new Date - old) * 1)} ms`, m)
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