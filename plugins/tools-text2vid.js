module.exports = {
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
         let [prompt, model] = text.split` | `
         var json = await Api.post('api/text2vid', {
            prompt, model
         })
         if (!json.status) return conn.reply(m.chat, Func.jsonFormat(json), m)
         return conn.sendFile(m.chat, json.data.images[0].url, '', json.data.negative_prompt, m)
      } catch (e) {
         console.log(e)
         return conn.reply(m.chat, Func.jsonFormat(e), m)
      }
   },
   help: ['text2vid'],
   use: 'prompt | model',
   tags: ['tools'],
   command: /^(text2vid)$/i,
   premium: true,
}