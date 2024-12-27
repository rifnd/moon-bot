module.exports = {
   help: ['weekly'],
   tags: ['user'],
   run: async (m, {
      conn,
      users,
      Func
   }) => {
      try {
         let timeClaim = 604800000
         let claimed = new Date(users.lastweekly + timeClaim)
         let timeout = claimed - new Date()
         let exp = Func.randomInt(10000, 100000)
         let money = Func.randomInt(10000, 100000)
         let limit = Func.randomInt(20, 50)
         if (new Date - users.lastweekly > timeClaim) {
            conn.reply(m.chat, `Congratulations!, you got\n\n+ ${Func.formatNumber(exp)} exp\n+ ${Func.formatNumber(money)} money\n+ ${limit} limit`, m)
            users.exp += exp
            users.money += money
            users.limit += limit
            users.lastweekly = new Date() * 1
         } else {
            conn.reply(m.chat, `You have claimed, you can reclaim in the next week.\n\nTimeout : [ ${Func.toTime(timeout)} ]`, m)
         }
      } catch (e) {
         conn.reply(m.chat, Func.jsonFormat(e), m)
      }
   }
}