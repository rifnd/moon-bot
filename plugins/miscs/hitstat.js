const moment = require('moment-timezone')
module.exports = {
   help: ['hitstat', 'hitdaily'],
   tags: ['miscs'],
   run: async (m, {
      conn,
      usedPrefix,
      command,
      Func
   }) => {
      let totalhit = Object.values(global.db.stats).reduce((sum, { hitstat }) => sum + hitstat, 0)
      let totaltoday = Object.values(global.db.stats).reduce((sum, { today }) => sum + today, 0)
      if (command == 'hitstat') {
         if (totalhit === 0) return conn.reply(m.chat, Func.texted('bold', '🚩 No commands hit'), m)
         let stats = Object.entries(global.db.stats).filter(([_, { hitstat }]) => hitstat > 0).slice(0, 10).sort(([, a], [, b]) => b.hitstat - a.hitstat).map(([key, { hitstat, lasthit }], idx) => {
            return `   ┌  *Command* : ${Func.texted('monospace', usedPrefix + key)}\n   │  *Hit* : ${hitstat}x\n   └  *Last Hit* : ${moment(lasthit).format('DD/MM/YY HH:mm:ss')}`
         }).join('\n\n')
         conn.reply(m.chat, '乂  *H I T S T A T*\n\n' + `“Total command hit statistics are currently ${Func.formatNumber(totalhit)} hits.”\n\n` + stats + '\n\n' + global.footer, m)
      } else if (command == 'hitdaily') {
         if (totaltoday === 0) return conn.reply(m.chat, Func.texted('bold', '🚩 No commands hit'), m)
         let stats = Object.entries(global.db.stats).filter(([_, { today }]) => today > 0).slice(0, 10).sort(([, a], [, b]) => b.today - a.today).map(([key, { today, lasthit }], idx) => {
            return `   ┌  *Command* : ${Func.texted('monospace', usedPrefix + key)}\n   │  *Hit* : ${today}x\n   └  *Last Hit* : ${moment(lasthit).format('DD/MM/YY HH:mm:ss')}`
         }).join('\n\n')
         conn.reply(m.chat, '乂  *H I T D A I L Y*\n\n' + `“Total command hit statistics for today ${Func.formatNumber(totaltoday)} hits.”\n\n` + stats + '\n\n' + global.footer, m)
      }
   }
}
