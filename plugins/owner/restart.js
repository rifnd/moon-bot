module.exports = {
   help: ['restart'],
   tags: ['owner'],
   command: /^(restart|debounce)$/i,
   run: async (m, {
      conn,
      Func
   }) => {
      await conn.reply(m.chat, Func.texted('bold', 'Restarting . . .'), m).then(async () => {
         await global.db.write()   
         process.send('reset')
      })
   },
   owner: true
}