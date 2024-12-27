module.exports = {
   help: ['text2img'],
   use: 'prompt | negative | model | ratio',
   tags: ['tools'],
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
         let [prompt, negative_prompt, model, ratio, upscale] = text.split` | `
         var json = await Api.post('api/text2img', {
            prompt, negative_prompt, model, ratio, upscale
         })
         if (!json.status) return conn.reply(m.chat, Func.jsonFormat(json), m)
         return conn.sendFile(m.chat, json.data.images[0].url, '', `🍟 *Process* : ${((new Date - old) * 1)} ms`, m)
      } catch (e) {
         return conn.reply(m.chat, Func.jsonFormat(e), m)
      }
   },
   limit: true,
   premium: true
}