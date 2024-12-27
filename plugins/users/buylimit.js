module.exports = {
   help: ['buy'],
   command: ['buyall'],
   use: 'amount',
   tags: ['user'],
   run: async (m, {
      conn,
      usedPrefix,
      command,
      args,
      Func
   }) => {
      try {
         let price = 35000
         let count = command.replace(/^buy/i, '')
         let users = global.db.users[m.sender]
         count = count ? /all/i.test(count) ? Math.floor(users.exp / price) : parseInt(count) : args[0] ? parseInt(args[0]) : 1
         count = Math.max(1, count)
         if (users.exp >= price * count) {
            users.exp -= price * count
            users.limit += count
            conn.reply(m.chat, `*-${Func.formatNumber(price * count)}* exp, *+${count}* limit`, m)
         } else {
            conn.reply(m.chat, `Your exp is not enough to buy *${count}* limit`, m)
         }
      } catch (e) {
         console.log(e)
         return conn.reply(m.chat, Func.jsonFormat(e), m)
      }
   }
}