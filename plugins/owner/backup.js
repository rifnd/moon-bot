const { Mongo, Postgre } = new (require('@moonr/utils'))
const { writeFileSync, readFileSync } = require('fs')
module.exports = {
   help: ['backup'],
   tags: ['owner'],
   run: async (m, {
      conn,
      env,
      Func
   }) => {
      try {
         const database = /mongo/.test(process.env.DATABASE_URL) ? new Mongo(process.env.DATABASE_URL, env.database) : /postgres/.test(process.env.DATABASE_URL) ? new Postgre(process.env.DATABASE_URL, env.database) : new (require('../../lib/system/localdb'))(env.database)
         m.react('🕒')
         await database.save(global.db)
         writeFileSync(env.database + '.json', JSON.stringify(global.db, null, 3), 'utf-8')
         await conn.sendFile(m.chat, readFileSync('./' + env.database + '.json'), env.database + '.json', '', m)
      } catch (e) {
         return conn.reply(m.chat, Func.jsonFormat(e), m)
      }
   },
   owner: true
}