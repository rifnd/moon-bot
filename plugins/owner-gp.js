module.exports = {
   run: async (m, {
      conn,
      usedPrefix,
      command,
      text,
      Func
   }) => {
      try {
         let ar = Object.keys(global.plugins)
         let ar1 = ar.map(v => v.replace('.js', ''))
         if (!text) return m.reply(Func.example(usedPrefix, command, 'miscs-owner'))
         if (!ar1.includes(text)) return m.reply(`'${text}' not found!\n\n${ar1.map(v => ' ' + v).join`\n`}`)
         conn.reply(m.chat, require('fs').readFileSync('./plugins/' + text + '.js', 'utf-8'), m)
      } catch (e) {
         console.log(e)
      }
   },
   help: ['gp'],
   use: 'name',
   tags: ['owner'],
   command: /^(gp|getplugin)$/i,
   owner: true
}