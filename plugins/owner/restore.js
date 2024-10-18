const { readFileSync } = require('fs')
module.exports = {
   help: ['restore'],
   tags: ['owner'],
   command: /^(restore)$/i,
   run: async (m, {
      conn,
      command,
      Func
   }) => {
      try {
         if (m.quoted && /document/.test(m.quoted.mtype) && m.quoted.mimetype === 'application/json') {
            const fn = await Func.getFile(await m.quoted.download())
            if (!fn.status) return m.reply(Func.texted('bold', '🚩 File cannot be downloaded.'))
            global.db.data = JSON.parse(readFileSync(fn.file, 'utf-8'))
            m.reply('✅ Database was successfully restored.').then(async () => {
               await global.db.save(JSON.parse(readFileSync(fn.file, 'utf-8')))
            })
         } else m.reply(Func.texted('bold', '🚩 Reply to the backup file first then reply with this feature.'))
      } catch (e) {
         console.log(e)
      }
   },
   owner: true
}