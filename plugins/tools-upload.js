module.exports = {
   run: async (m, {
      conn,
      Scraper,
      Func
   }) => {
      try {
         let q = m.quoted ? m.quoted : m
         let mime = (q.msg || q).mimetype || ''
         if (!mime) return conn.reply(m.chat, Func.texted('bold', '🚩 Send or reply media'), m)
         m.react('🕒')
         let media = await q.download()
         let isMedia = /image\/(png|jpe?g|gif)|video\/mp4\/webp/.test(mime)
         let json = await (isMedia ? Scraper.telegraph : Scraper.uploader)(media)
         conn.reply(m.chat, json.data.url, m)
      } catch (e) {
         console.log(e)
         return conn.reply(m.chat, Func.jsonFormat(e), m)
      }
   },
   help: ['upload'],
   use: 'reply media',
   tags: ['tools'],
   command: /^(upload|tourl)$/i,
   limit: true,
}