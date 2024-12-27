const { Mongo, Postgre } = new (require('@moonr/utils'))
const { readFileSync } = require('fs')
module.exports = {
   help: ['restore'],
   tags: ['owner'],
   run: async (m, {
      conn,
      command,
      env,
      Func
   }) => {
      try {
         const database = /mongo/.test(process.env.DATABASE_URL) ? new Mongo(process.env.DATABASE_URL, env.database) : /postgres/.test(process.env.DATABASE_URL) ? new Postgre(process.env.DATABASE_URL, env.database) : new (require('../../lib/system/localdb'))(env.database)
         if (m.quoted && /document/.test(m.quoted.mtype) && m.quoted.mimetype === 'application/json') {
            const fn = await Func.getFile(await m.quoted.download())
            if (!fn.status) return m.reply('File cannot be downloaded.')
            global.db = JSON.parse(readFileSync(fn.file, 'utf-8'))
            m.reply('Database was successfully restored.').then(async () => {
               await database.save(JSON.parse(readFileSync(fn.file, 'utf-8')))
            })
         } else m.reply('Reply to the backup file first then reply with this feature.')
      } catch (e) {
         console.log(e)
      }
   },
   owner: true
}