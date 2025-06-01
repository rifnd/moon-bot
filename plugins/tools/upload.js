module.exports = {
   help: ['upload'],
   command: ['tourl'],
   use: 'reply media',
   tags: ['tools'],
   run: async (m, {
      conn,
      Scraper,
      Func
   }) => {
      try {
         let q = m.quoted ? m.quoted : m
         let mime = (q.msg || q).mimetype || ''
         if (!mime) return conn.reply(m.chat, Func.texted('bold', '🚩 Send or reply to the media you want to upload.'), m)
         m.react('🕒')
         let media = await q.download()
         //let isMedia = /image\/(png|jpe?g|gif)|video\/mp4\/webp/.test(mime)
         //let json = await (isMedia ? Scraper.imgbb : Scraper.uploader)(media)
         let json = await Scraper.tmpfiles(media)
         conn.reply(m.chat, json.data.url, m)
      } catch (e) {
         return conn.reply(m.chat, Func.jsonFormat(e), m)
      }
   },
   limit: true
}