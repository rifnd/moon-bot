module.exports = {
   async before(m, {
      conn,
      match,
      usedPrefix,
      plugins,
      setting,
      Func
   }) {
      if (match || setting.noprefix) {
         let txt = m.text.toLowerCase()
         usedPrefix = setting.prefix.find(p => txt.startsWith(p)) || ''
         let Prefix = txt.replace(usedPrefix, '').trim().split(' ')[0]
         if (['>', '=>', '$'].some(prefix => Prefix.startsWith(prefix))) return true
         let commands = new Set()
         Object.values(plugins).forEach(v => {
            if (typeof v.command === 'string') {
               commands.add(v.command)
            } else if (Array.isArray(v.command)) {
               v.command.forEach(cmd => commands.add(cmd))
            }
            if (Array.isArray(v.help)) {
               v.help.forEach(cmd => commands.add(cmd))
            }
         })
         let commandList = Array.from(commands)//.slice(0, 200)
         if (commandList.length === 0) return true
         const { similarCommands, highestSimilarity } = Func.findMostSimilar(Prefix, commandList)
         if (highestSimilarity >= 0.7 && highestSimilarity < 1) {
            const recommendations = similarCommands.map(command => `➠ *${usedPrefix + command}* (${(highestSimilarity * 100).toFixed(2)}%)`).join('\n')
            conn.reply(m.chat, `Maybe the command you are using is not right, try the following recommendations :\n\n${recommendations}`, m)
         }
      }
   },
   error: false
}