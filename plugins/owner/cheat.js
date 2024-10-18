module.exports = {
   help: ['pay'],
   use: 'type amount @tag',
   tags: ['owner'],
   command: /^(pay|cheat)$/i,
   run: async (m, {
      conn,
      usedPrefix,
      command,
      args,
      Func
   }) => {
      try {
         let type = (args[0] || '').toLowerCase()
         let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender
         if (/pay|cheat/i.test(command)) {
            const count = args[1] && args[1].length > 0 ? Math.max(parseInt(args[1]), 1) : !args[1] || args.length < 3 ? 1 : Math.min(1, count)
            switch (type) {
               case 'exp':
                  if (typeof global.db.data.users[who] == 'undefined') return conn.reply(m.chat, Func.texted('Bold', '🚩 The user does not exist in the database'), m)
                  global.db.data.users[who].exp += count * 1
                  conn.reply(m.chat, `Added successfully ${count * 1} ${type}`, m)
                  break // Attention, the exp cheat can make your database error!!
               case 'money':
                  if (typeof global.db.data.users[who] == 'undefined') return conn.reply(m.chat, Func.texted('Bold', '🚩 The user does not exist in the database'), m)
                  global.db.data.users[who].money += count * 1
                  conn.reply(m.chat, `Added successfully ${count * 1} ${type}`, m)
                  break
               case 'limit':
                  if (typeof global.db.data.users[who] == 'undefined') return conn.reply(m.chat, Func.texted('Bold', '🚩 The user does not exist in the database'), m)
                  global.db.data.users[who].limit += count * 1
                  conn.reply(m.chat, `Added successfully ${count * 1} ${type}`, m)
                  break
               default:
                  return conn.reply(m.chat, Func.example(usedPrefix, command, 'exp 10 @628xx'), m)
            }
         }
      } catch (e) {
         console.log(e)
      }
   },
   owner: true
}