const fs = require('fs')
module.exports = {
   help: ['getplugin'],
   command: ['gp', 'getfile'],
   use: 'filename',
   tags: ['owner'],
   run: async (m, {
      conn,
      usedPrefix,
      command,
      text,
      plugins,
      Func
   }) => {
      try {
         let ar = Object.keys(plugins)
         let ar1 = ar.map(v => v.replace('.js', ''))
         if (!text) return conn.reply(m.chat, Func.example(usedPrefix, command, 'menu'), m)
         if (!ar1.includes(text)) return conn.reply(m.chat, `'${text}' not found!\n\n${ar1.map(v => ' ' + v).join`\n`}`, m)
         conn.reply(m.chat, fs.readFileSync('./plugins/' + text + '.js', 'utf-8'), m)
      } catch (e) {
         return conn.reply(m.chat, Func.jsonFormat(e), m)
      }
   },
   owner: true
}