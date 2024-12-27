
module.exports = {
   help: ['hdvideo'],
   use: 'reply video',
   tags: ['tools'],
   run: async (m, {
      conn,
      usedPrefix,
      Scraper,
      Func
   }) => {
      try {
         if (m.quoted ? m.quoted.message : m.msg.viewOnce) {
            let type = m.quoted ? Object.keys(m.quoted.message)[0] : m.mtype
            let q = m.quoted ? m.quoted.message[type] : m.msg
            if (/video/.test(type)) {
               m.react('🕒')
               let old = new Date()
               let vid = await conn.downloadMediaMessage(q)
               let result = await Scraper.uploader(vid)
               const json = await Api.get('api/remini-video', {
                  video: result.data.url
               })
               if (!json.status) return m.reply(Func.jsonFormat(json))
               conn.sendFile(m.chat, json.data.url, '', `🍟 *Process* : ${((new Date - old) * 1)} ms`, m)
            } else conn.reply(m.chat, Func.texted('bold', `🚩 Only for photo.`), m)
         } else {
            let q = m.quoted ? m.quoted : m
            let mime = (q.msg || q).mimetype || ''
            if (!mime) return conn.reply(m.chat, Func.texted('bold', `🚩 Reply photo.`), m)
            if (!/video\/(mp4)/.test(mime)) return conn.reply(m.chat, Func.texted('bold', `🚩 Only for photo.`), m)
            m.react('🕒')
            let old = new Date()
            let vid = await q.download()
            let result = await Scraper.uploader(vid)
            const json = await Api.get('api/remini-video', {
               video: result.data.url
            })
            if (!json.status) return m.reply(Func.jsonFormat(json))
            conn.sendFile(m.chat, json.data.url, '', `🍟 *Process* : ${((new Date - old) * 1)} ms`, m)
         }
      } catch (e) {
         return conn.reply(m.chat, Func.jsonFormat(e), m)
      }
   },
   limit: true,
   premium: true
}