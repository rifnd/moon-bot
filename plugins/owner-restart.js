module.exports = {
   run: async (m, {
      conn,
      usedPrefix,
      command,
      args,
      Func
   }) => {
      if (global.conn.user.jid == conn.user.jid) {
         await conn.reply(m.chat, Func.texted('bold', 'Restarting . . .'), m)
         await global.db.write()
         process.send('reset')
      }
   },
   help: ['restart'],
   tags: ['owner'],
   command: /^(restart|debounce)$/i,
   owner: true
}