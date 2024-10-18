module.exports = {
   help: ['dare', 'truth'],
   tags: ['fun'],
   command: /^(truth|dare)$/i,
   run: async (m, {
      conn,
      command,
      Func
   }) => {
      try {
         if (command == 'dare') {
            let json = await Func.fetchJson('https://raw.githubusercontent.com/NzrlAfndi/Databasee/main/text/dare.json')
            conn.reply(m.chat, json[Math.floor(Math.random() * json.length)], m)
         } else if (command == 'truth') {
            const json = await Func.fetchJson('https://raw.githubusercontent.com/NzrlAfndi/Databasee/main/text/truth.json')
            conn.reply(m.chat, json[Math.floor(Math.random() * json.length)], m)
         }
      } catch (e) {
         console.log(e)
      }
   },
   limit: true
}