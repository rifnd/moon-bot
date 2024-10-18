module.exports = {
   help: ['buy'],
   use: 'amount',
   tags: ['user'],
   command: /^buy([0-9]+)|buy|buyall$/i,
   run: async (m, {
      conn,
      usedPrefix,
      command,
      args,
      users,
      Func
   }) => {
      try {
         let price = 35000
         let count = command.replace(/^buy/i, '')
         count = count ? /all/i.test(count) ? Math.floor(users.exp / price) : parseInt(count) : args[0] ? parseInt(args[0]) : 1
         count = Math.max(1, count)
         if (users.exp >= price * count) {
            users.exp -= price * count
            users.limit += count
            conn.reply(m.chat, Func.texted('bold', `-${Func.formatNumber(price * count)} Exp, +${count} Limit`), m)
         } else {
            conn.reply(m.chat, Func.texted('bold', `🚩 Your exp is not enough to buy ${count} limit`), m)
         }
      } catch (e) {
         console.log(e)
         return conn.reply(m.chat, Func.jsonFormat(e), m)
      }
   }
}