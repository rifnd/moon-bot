const moment = require('moment-timezone')
module.exports = {
   command: ['help'],
   tags: ['miscs'],
   command: /^(hitstat)$/i,
   run: async (m, {
      conn,
      plugins,
      Func
   }) => {
      let stats = Object.entries(global.db.data.stats).map(([key, val]) => {
         let name = Array.isArray(plugins[key]?.help) ? plugins[key]?.help?.join(' & ') : plugins[key]?.help || key
         if (/exec/.test(name)) return
         return { name, ...val }
      })
      stats = stats.sort((a, b) => b.total - a.total)
      let txt = stats.slice(0, 10).map(({ name, total, last }, idx) => {
         if (name.includes('-') && name.endsWith('.js')) name = name.split('-')[1].replace('.js', '')
         return `${idx + 1}. *Command* : ${name}\n   *Hit* : ${total}x\n   *Last Hit* : ${moment(last).format('DD/MM/YY HH:mm:ss')}`
      }).join`\n`
      conn.sendMessageModify(m.chat, '乂  *H I T S T A T*\n\n' + txt + '\n\n' + global.footer, m, {
         largeThumb: true
      })
   }
}