module.exports = {
   help: ['mathsolver'],
   command: ['mathresolver'],
   use: 'expression',
   tags: ['ai'],
   run: async (m, {
      conn,
      usedPrefix,
      command,
      text,
      Func
   }) => {
      try {
         if (!text) return m.reply(Func.example(usedPrefix, command, '1 + 1'))
         m.react('🕒')
         const json = await Api.get('api/ai-mathsolver', {
            q: text
         })
         if (!json.status) return m.reply(Func.jsonFormat(json))
         m.reply(json.data.answer)
      } catch (e) {
         return conn.reply(m.chat, Func.jsonFormat(e), m)
      }
   },
   limit: true,
   premium: true,
}