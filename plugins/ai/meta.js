module.exports = {
   help: ['meta'],
   use: 'prompt',
   tags: ['ai'],
   run: async (m, {
      conn,
      usedPrefix,
      command,
      text,
      Scraper,
      Func
   }) => {
      try {
         if (!text) return conn.reply(m.chat, Func.example(usedPrefix, command, 'mark itu orang atau alien'), m)
         m.react('🕒')
         var result = await Api.get('api/ai-meta', {
            prompt: text
         })
         var media = []
         if (!result.status) return conn.reply(m.chat, `🚩 ${result.msg}`, m)
         if (result.data.imagine_media.length != 0) {
            result.data.imagine_media.map(async v => {
               media.push({
                  url: v.uri
               })
            })
            conn.sendAlbumMessage(m.chat, media, m)
         } else {
            conn.reply(m.chat, result.data.content, m)
         }
      } catch (e) {
         return conn.reply(m.chat, Func.jsonFormat(e), m)
      }
   },
   limit: true,
}