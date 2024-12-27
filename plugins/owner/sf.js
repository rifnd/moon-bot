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
         if (!m.quoted.text) return conn.reply(m.chat, `reply code`, m)
         let path = `${text}`
         await require('fs').writeFileSync(path, m.quoted.text)
         conn.reply(m.chat, `Saved ${path} to file!`, m)
      } catch (e) {
         console.log(e)
      }
   },
   owner: true
}