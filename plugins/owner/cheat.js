module.exports = {
   help: ['cheat'],
   command: ['pay'],
   use: 'type amount @tag/reply',
   tags: ['owner'],
   run: async (m, {
      conn,
      usedPrefix,
      command,
      args,
      Func
   }) => {
      try {
         let type = (args[0] || '').toLowerCase()
         let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted && m.quoted.sender ? m.quoted.sender : null
         if (!who || who === conn.user.jid) return conn.reply(m.chat, Func.texted('bold', 'Invalid target. You cannot use this command on bots.'), m)
         if (!type || !args[1] || isNaN(args[1])) return conn.reply(m.chat, Func.example(usedPrefix, command, `${args[0]} 10 @628xx`), m)
         if (/pay|cheat/i.test(command)) {
            const count = Math.max(parseInt(args[1]), 1)
            switch (type) {
               case 'exp':
                  if (typeof global.db.users[who] == 'undefined') return conn.reply(m.chat, Func.texted('bold', 'The user does not exist in the database'), m)
                  global.db.users[who].exp += count * 1
                  conn.reply(m.chat, `Successfully added ${count * 1} ${type} to @${who.split`@`[0]}`, m)
               break // Attention, the exp cheat can make your database error!!
               case 'money':
                  if (typeof global.db.users[who] == 'undefined') return conn.reply(m.chat, Func.texted('bold','The user does not exist in the database'), m)
                  global.db.users[who].money += count * 1
                  conn.reply(m.chat, `Successfully added ${count * 1} ${type} to @${who.split`@`[0]}`, m)
               break
               case 'limit':
                  if (typeof global.db.users[who] == 'undefined') return conn.reply(m.chat, Func.texted('bold','The user does not exist in the database'), m)
                  global.db.users[who].limit += count * 1
                  conn.reply(m.chat, `Successfully added ${count * 1} ${type} to @${who.split`@`[0]}`, m)
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