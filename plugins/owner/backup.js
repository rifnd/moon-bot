const { writeFileSync, readFileSync } = require('fs')
module.exports = {
   help: ['backup'],
   tags: ['owner'],
   command: /^(backup)$/i,
   run: async (m, {
      conn,
      command,
      Func
   }) => {
      try {
         await m.react('🕒')
         await global.db.write()
         writeFileSync('database.json', JSON.stringify(global.db.data, null, 3), 'utf-8')
         await conn.sendFile(m.chat, readFileSync('./database.json'), 'database.json', '', m)
      } catch (e) {
         return conn.reply(m.chat, Func.jsonFormat(e), m)
      }
   },
   owner: true
}