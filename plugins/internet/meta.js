module.exports = {
   help: ['meta'],
   use: 'prompt',
   tags: ['internet'],
   run: async (m, {
      conn,
      usedPrefix,
      command,
      text,
      Scraper,
      Func
   }) => {
      try {
         if (!text) return m.reply(Func.example(usedPrefix, command, 'hi'))
         m.react('🕒')
         var result = await Api.get('api/ai-meta', {
            prompt: text
         })
         if (!result.status) return m.reply(result.msg || null)
         if (result.data.imagine_media.length != 0) {
            result.data.imagine_media.map(async v => {
               await conn.sendFile(m.chat, v.uri, '', '', m)
               await Func.delay(1500)
            })
         } else {
            conn.reply(m.chat, result.data.content, m)
         }
      } catch (e) {
         return conn.reply(m.chat, Func.jsonFormat(e), m)
      }
   },
   limit: true,
   premium: true
}