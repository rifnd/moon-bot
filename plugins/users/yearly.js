module.exports = {
   help: ['yearly'],
   tags: ['user'],
   command: /^(yearly)$/i,
   run: async (m, {
      conn,
      users,
      Func
   }) => {
      try {
         let timeClaim = 2592000000
         let claimed = new Date(users.lastyearly + timeClaim)
         let timeout = claimed - new Date()
         let exp = Func.randomInt(10000, 100000)
         let money = Func.randomInt(10000, 100000)
         let limit = Func.randomInt(150, 300)
         if (new Date - users.lastyearly > timeClaim) {
            conn.reply(m.chat, Func.texted('bold', `🎉 Congratulations!, you got +${Func.formatNumber(exp)} exp, +${Func.formatNumber(money)} money & +${limit} limit.`), m)
            users.exp += exp
            users.money += money
            users.limit += limit
            users.lastyearly = new Date() * 1
         } else {
            conn.reply(m.chat, `*You have claimed, you can reclaim in the next year.*\n\n*Timeout : [ ${Func.toTime(timeout)} ]*`, m)
         }
      } catch (e) {
         conn.reply(m.chat, Func.jsonFormat(e), m)
      }
   }
}