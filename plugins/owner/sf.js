module.exports = {
   help: ['savefile'],
   command: ['sf', 'sfp'],
   use: 'reply code',
   tags: ['owner'],
   run: async (m, {
      conn,
      usedPrefix,
      command,
      text,
      Func
   }) => {
      try {
         if (!text) return conn.reply(m.chat, Func.example(usedPrefix, command, 'miscs/ping.js'), m)
         if (!m.quoted.text) return conn.reply(m.chat, Func.texted('bold', '🚩 Reply code with command.'), m)
         await require('fs').writeFileSync(text, m.quoted.text)
         conn.reply(m.chat, `Saved ${text} to file!`, m)
      } catch (e) {
         console.log(e)
      }
   },
   owner: true
}