module.exports = {
   async before(m, { conn, users, isPrems, setting, Func }) {
      try {
         if (setting.autodownload && isPrems) {
            const regex = /^(?:https?:\/\/)?(?:www\.)?(?:instagram\.com\/)(?:tv\/|p\/|reel\/)(?:\S+)?$/;
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
                     let json = await Api.get('api/ig', {
                        url: link
                     })
                     if (!json.status) return conn.reply(m.chat, Func.jsonFormat(json), m)
                     for (let i of json.data) {
                        conn.sendFile(m.chat, i.url, i.type == 'video' ? Func.filename('mp4') : Func.filename('jpg'), `🍟 *Process* : ${((new Date - old) * 1)} ms`, m)
                        await Func.delay(1500)
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