module.exports = {
   async before(m, {
      conn,
      match,
      usedPrefix,
      plugins,
      Func
   }) {
      usedPrefix = (match[0] || '')[0] || (global.db.data.setting.noprefix ? '' : undefined)
      if (usedPrefix !== undefined) {
         let noPrefix = m.text.replace(usedPrefix, '').trim().split(' ')[0]
         /** except eval, exec */
         if (['>', '=>', '$'].some(prefix => noPrefix.startsWith(prefix))) return true
         let help = Object.values(plugins).flatMap(v => {
            let commands = v.help ? v.help : []
            if (v.command && typeof v.command === 'string') {
               commands.push(v.command)
            } else if (v.command && v.command instanceof RegExp) {
               commands.push(...(noPrefix.match(v.command) || []))
            }
            return commands
         })
         if (help.length === 0) return true
         if (help.includes(noPrefix)) return
         let { mostSimilar: mean, highestSimilarity: sim } = Func.findMostSimilar(noPrefix, help)
         if (sim >= 0.7 && sim < 1) {
            conn.reply(m.chat, `The command you are using may be incorrect, try the following recommendations :\n\n→ ${usedPrefix + mean} (${(sim * 100).toFixed(2)}%)`, m)
         }
      }
      return true
   }
}