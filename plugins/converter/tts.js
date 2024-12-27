module.exports = {
   help: ['tts'],
   use: 'iso text',
   tags: ['converter'],
   run: async (m, {
      conn,
      usedPrefix,
      command,
      args,
      Func
   }) => {
      const defaultLang = 'id'
      try {
         if (!args[0]) return m.reply(Func.example(usedPrefix, command, 'id hello guys'))
         let text = args.slice(1).join('')
         if ((args[0] || '').length !== 2) {
            lang = defaultLang
            text = args.join(' ')
         }
         if (!text && m.quoted && m.quoted.text) text = m.quoted.text
         conn.sendPresenceUpdate('recording', m.chat)
         let json = await Api.get('api/tts', {
            text: text, iso: args[0]
         })
         conn.sendFile(m.chat, json.data.url, 'audio.mp3', '', m)
      } catch (e) {
         return conn.reply(m.chat, Func.texted('bold', `🚩 Language code not supported.`), m)
      }
   },
   limit: true
}