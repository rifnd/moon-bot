module.exports = {
   run: async (m, {
      conn,
      usedPrefix,
      command,
      text,
      Scraper,
      Func
   }) => {
      if (!text) return m.reply(Func.example(usedPrefix, command, 'moonbot'))
      m.react('🕒')
      let q = m.quoted ? m.quoted : m
      let mime = (q.msg || q).mimetype || ''
      try {
         if (/image\/(jpe?g|png)/.test(mime)) {
            var p = await q.download()
            var respon = await Scraper.uploader(p)
            var json = await Api.get('api/func-chat', {
               model: 'blackbox',
               system: text,
               image: respon.data.url
            })
            if (!json.status) return m.reply(Func.jsonFormat(json))
            m.reply(json.data.content)
         } else if (text) {
            var result = await Api.get('api/ai-blackbox', {
               prompt: text
            })
            if (!result.status) return m.reply(Func.jsonFormat(json))
            m.reply(result.data.content)
         }
      } catch (e) {
         console.log(e)
         return conn.reply(m.chat, Func.jsonFormat(e), m)
      }
   },
   help: ['blackbox'],
   use: 'query',
   tags: ['tools'],
   command: /^(blackbox)$/i,
   limit: true,
}