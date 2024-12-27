module.exports = {
   help: ['tovideo'],
   command: ['togif'],
   use: 'reply gif sticker',
   tags: ['converter'],
   run: async (m, {
      conn,
      Scraper,
      Func
   }) => {
      try {
         let exif = global.db.setting
         if (!m.quoted) return conn.reply(m.chat, Func.texted('bold', `🚩 Reply to gif sticker.`), m)
         let q = m.quoted ? m.quoted : m
         let mime = (q.msg || q).mimetype || ''
         if (!/webp/.test(mime)) return conn.reply(m.chat, Func.texted('bold', `🚩 Reply to gif sticker.`), m)
         let buffer = await q.download()
         const file = await Scraper.uploader(buffer)
         if (!file.status) return m.reply(Func.jsonFormat(file))
         let old = new Date()
         m.react('🕒')
         const json = await Api.get('api/webp-convert', {
            url: file.data.url, action: 'webp-to-mp4'
         })
         conn.sendFile(m.chat, json.data.url, '', `🍟 *Process* : ${((new Date - old) * 1)} ms`, m)
      } catch (e) {
         return conn.reply(m.chat, global.status.error, m)
      }
   },
   limit: true
}