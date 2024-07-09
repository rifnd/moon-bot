let handler = async (m, {
   usedPrefix,
   command,
   text
}) => {
   try {
      if (!text) return m.reply(Func.example(usedPrefix, command, 'kucing'))
      m.react('🕒')
      let q = m.quoted ? m.quoted : m
      let mime = (q.msg || q).mimetype || ''
      if (/image\/(jpe?g|png)/.test(mime)) {
         try {
            let img = await q.download()
            let res = await scrap.uploader(img)
            let respon = await Func.fetchJson(API('alya', '/api/func-chat', { model: 'bard', system: text, image: res.data.url }, 'apikey'))
            if (!respon.status) return m.reply(Func.jsonFormat(respon))
            m.reply(respon.data.content)
         } catch (i) {
            return client.reply(m.chat, Func.jsonFormat(i), m)
         }
      } else if (text) {
         const json = await Func.fetchJson(API('alya', '/api/bard-google-ai', { q: text }, 'apikey'))
         if (!json.status) return m.reply(Func.jsonFormat(json))
         m.reply(json.data.chats)
      }
   } catch (e) {
      console.log(e)
      m.reply(Func.jsonFormat(e))
   }
}
handler.help = handler.command = ['bard']
handler.tags = ['internet']
handler.limit = true
module.exports = handler