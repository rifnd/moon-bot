module.exports = {
   help: ['text2vid'],
   use: 'prompt | model',
   tags: ['tools'],
   command: /^(text2vid)$/i,
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
         let old = new Date()
         let [prompt, model] = text.split` | `
         var json = await Api.post('api/text2vid', {
            prompt, model
         })
         if (!json.status) return conn.reply(m.chat, Func.jsonFormat(json), m)
         conn.sendFile(m.chat, json.data.output[0], '', `🍟 *Process* : ${((new Date - old) * 1)} ms`, m)
      } catch (e) {
         console.log(e)
         return conn.reply(m.chat, Func.jsonFormat(e), m)
      }
   },
   premium: true,
}