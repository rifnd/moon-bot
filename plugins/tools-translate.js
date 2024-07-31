module.exports = {
   run: async (m, {
      conn,
      usedPrefix,
      command,
      text,
      Scraper,
      Func
   }) => {
      if (!text) return m.reply(Func.example(usedPrefix, command, 'id Love You'))
      m.react('🕒')
      if (text && m.quoted && m.quoted.text) {
         let lang = text.slice(0, 2)
         try {
            let data = m.quoted.text
            const result = await Api.get('api/translate', {
               text: data,
               iso: lang
            })
            conn.reply(m.chat, result.data.text, m)
         } catch {
            return m.reply(Func.texted('bold', '🚩 Language codes are not supported.'))
         }
      } else if (text) {
         let lang = text.slice(0, 2)
         try {
            let data = text.substring(2).trim()
            const result = await Api.get('api/translate', {
               text: data,
               iso: lang
            })
            conn.reply(m.chat, result.data.text, m)
         } catch {
            return m.reply(Func.texted('bold', '🚩 Language codes are not supported.'))
         }
      }
   },
   help: ['translate'],
   use: 'lang text',
   tags: ['tools'],
   command: /^(tr(anslate)?)$/i,
   limit: true,
}