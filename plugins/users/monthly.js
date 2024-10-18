module.exports = {
   help: ['monthly'],
   tags: ['user'],
   command: /^(monthly)$/i,
   run: async (m, {
      conn,
      users,
      Func
   }) => {
      try {
         let timeClaim = 2592000000
         let claimed = new Date(users.lastmonthly + timeClaim)
         let timeout = claimed - new Date()
         let exp = Func.randomInt(10000, 100000)
         let money = Func.randomInt(10000, 100000)
         let limit = Func.randomInt(50, 100)
         if (new Date - users.lastmonthly > timeClaim) {
            conn.reply(m.chat, Func.texted('bold', `🎉 Congratulations!, you got +${Func.formatNumber(exp)} exp, +${Func.formatNumber(money)} money & +${limit} limit.`), m)
            users.exp += exp
            users.money += money
            users.limit += limit
            users.lastmonthly = new Date() * 1
         } else {
            conn.reply(m.chat, `*You have claimed, you can reclaim in the next month.*\n\n*Timeout : [ ${Func.toTime(timeout)} ]*`, m)
         }
      } catch (e) {
         conn.reply(m.chat, Func.jsonFormat(e), m)
      }
   }
}