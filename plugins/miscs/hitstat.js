const moment = require('moment-timezone')
module.exports = {
   help: ['hitstat', 'hitdaily'],
   tags: ['miscs'],
   command: /^(hitstat|hitdaily)$/i,
   run: async (m, {
      conn,
      usedPrefix,
      plugins
   }) => {
      const today = moment().format('YYYY-MM-DD')
      let stats = Object.entries(global.db.data.stats).map(([key, val]) => {
         let name = Array.isArray(plugins[key]?.help) ? plugins[key]?.help?.join(' & ') : plugins[key]?.help || key
         if (/exec/.test(name)) return
         if (name.includes('-') && name.endsWith('.js')) {
            name = name.split('-')[1].replace('.js', '')
         }
         if (!val.total) val.total = 0
         if (!val.hitdaily) val.hitdaily = {}
         val.total += val.hitstat || 0
         if (!val.hitdaily[today]) val.hitdaily[today] = 0
         val.hitdaily[today] += val.hitstat || 0
         return { name, ...val }
      })
      if (/hitstat/i.test(m.text)) {
         let suki = stats.slice(0, 10).map(({ name, total, last }, idx) => {
            return `   ┌  ${idx + 1}. *Command* : ${usedPrefix + name}\n   │  *Hit Total* : ${total}x\n   └  *Last Hit* : ${moment(last).format('DD/MM/YY HH:mm:ss')}`
         }).join('\n\n')
         conn.reply(m.chat, '乂  *H I T S T A T*\n\n' + suki + '\n\n' + global.footer, m)
      } else if (/hitdaily/i.test(m.text)) {
         let txt = stats.slice(0, 10).map(({ name, hitdaily, last }, idx) => {
            let dailyHits = hitdaily[today] || 0
            return `   ┌  ${idx + 1}. *Command* : ${usedPrefix + name}\n   │  *Today* : ${dailyHits}x\n   └  *Last Hit* : ${moment(last).format('DD/MM/YY HH:mm:ss')}`
         }).join('\n\n')
         conn.reply(m.chat, '乂  *H I T D A I L Y*\n\n' + txt + '\n\n' + global.footer, m)
      }
   }
}