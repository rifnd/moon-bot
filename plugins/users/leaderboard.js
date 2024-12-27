module.exports = {
   help: ['leaderboard'],
   command: ['lb'],
   tags: ['user'],
   run: async (m, {
      conn,
      args,
      participants,
      Func
   }) => {
      let users = Object.entries(global.db.users).map(([key, value]) => {
         return { ...value, jid: key }
      })
      let sortedExp = users.map(Func.toNumber('exp')).sort(Func.sort('exp'))
      let sortedLim = users.map(Func.toNumber('limit')).sort(Func.sort('limit'))
      let sortedLevel = users.map(Func.toNumber('level')).sort(Func.sort('level'))
      let sortedMoney = users.map(Func.toNumber('money')).sort(Func.sort('money'))
      let usersExp = sortedExp.map(Func.enumGetKey)
      let usersLim = sortedLim.map(Func.enumGetKey)
      let usersLevel = sortedLevel.map(Func.enumGetKey)
      let usersMoney = sortedMoney.map(Func.enumGetKey)
      let len = args[0] && args[0].length > 0 ? Math.min(10, Math.max(parseInt(args[0]), 10)) : Math.min(10, sortedExp.length)
      let text = `
• *XP Leaderboard Top ${len}* •
You: *${usersExp.indexOf(m.sender) + 1}* from *${usersExp.length}*
       
${sortedExp.slice(0, len).map(({ jid, exp }, i) => `${i + 1}. ${participants.some(p => jid === p.jid) ? `(${conn.getName(jid)}) wa.me/` : '@'}${jid.split`@`[0]} *${exp} Exp*`).join`\n`}
       
• *Limit Leaderboard Top ${len}* •
You: *${usersLim.indexOf(m.sender) + 1}* from *${usersLim.length}*
       
${sortedLim.slice(0, len).map(({ jid, limit }, i) => `${i + 1}. ${participants.some(p => jid === p.jid) ? `(${conn.getName(jid)}) wa.me/` : '@'}${jid.split`@`[0]} *${limit} Limit*`).join`\n`}
       
• *Level Leaderboard Top ${len}* •
You: *${usersLevel.indexOf(m.sender) + 1}* from *${usersLevel.length}*
       
${sortedLevel.slice(0, len).map(({ jid, level }, i) => `${i + 1}. ${participants.some(p => jid === p.jid) ? `(${conn.getName(jid)}) wa.me/` : '@'}${jid.split`@`[0]} *Level ${level}*`).join`\n`}
       
• *Money Leaderboard Top ${len}* •
You: *${usersMoney.indexOf(m.sender) + 1}* from *${usersMoney.length}*
       
${sortedMoney.slice(0, len).map(({ jid, money }, i) => `${i + 1}. ${participants.some(p => jid === p.jid) ? `(${conn.getName(jid)}) wa.me/` : '@'}${jid.split`@`[0]} *Money ${money}*`).join`\n`}`.trim()
      conn.reply(m.chat, text, m, {
         contextInfo: {
            mentionedJid: [...usersExp.slice(0, len), ...usersLim.slice(0, len), ...usersLevel.slice(0, len), ...usersMoney.slice(0, len)].filter(v => !participants.some(p => v === p.jid))
         }
      })
   }
}