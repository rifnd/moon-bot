module.exports = {
   help: ['monthly'],
   tags: ['user'],
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
            conn.reply(m.chat, `Congratulations!, you got\n\n+ ${Func.formatNumber(exp)} exp\n+ ${Func.formatNumber(money)} money\n+ ${limit} limit`, m)
            users.exp += exp
            users.money += money
            users.limit += limit
            users.lastmonthly = new Date() * 1
         } else {
            conn.reply(m.chat, `You have claimed, you can reclaim in the next month.\n\nTimeout : [ ${Func.toTime(timeout)} ]`, m)
         }
      } catch (e) {
         conn.reply(m.chat, Func.jsonFormat(e), m)
      }
   }
}