module.exports = {
   run: async (m, {
      conn,
      usedPrefix,
      command,
      text,
      Func
   }) => {
      try {
         if (!text) return m.reply(Func.example(usedPrefix, command, 'How to create delay function | js'))
         let [code, act] = text.split` | `
         conn.react(m.chat, '🕒', m.key)
         const json = await Api.get('api/ai-code', {
            text: code, action: act
         })
         if (!json.status) return m.reply(Func.jsonFormat(json))
         m.reply(json.data.code)
      } catch (e) {
         console.log(e)
         return m.reply(Func.jsonFormat(e))
      }
   },
   help: ['code'],
   use: 'query | lang',
   tags: ['tools'],
   command: /^(code)$/i,
   premium: true,
}