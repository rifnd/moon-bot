module.exports = {
   help: ['animediff'],
   use: 'prompt',
   tags: ['internet'],
   command: /^(animediff)$/i,
   run: async (m, {
      conn,
      usedPrefix,
      command,
      text,
      Func
   }) => {
      try {
         if (!text) return conn.reply(m.chat, Func.example(usedPrefix, command, 'cat'), m)
         m.react('🕒')
         var json = await Api.get('api/animediff', {
            q: text
         })
         if (!json.status) return conn.reply(m.chat, Func.jsonFormat(json), m)
         return conn.sendFile(m.chat, json.data[0].node.media.urls[0].url, Func.filename('jpg'), json.data[0].node.prompts, m)
      } catch (e) {
         console.log(e)
         return conn.reply(m.chat, Func.jsonFormat(e), m)
      }
   },
   premium: true,
}