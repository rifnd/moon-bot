module.exports = {
   help: ['daily'],
   tags: ['user'],
   run: async (m, {
      conn,
      users,
      Func
   }) => {
      try {
         let timeClaim = 86400000
         let claimed = new Date(users.lastclaim + timeClaim)
         let timeout = claimed - new Date()
         let exp = Func.randomInt(5000, 50000)
         let money = Func.randomInt(5000, 50000)
         let limit = Func.randomInt(5, 10)
         if (new Date - users.lastclaim > timeClaim) {
            conn.reply(m.chat, `Congratulations!, you got\n\n+ ${Func.formatNumber(exp)} exp\n+ ${Func.formatNumber(money)} money\n+ ${limit} limit`, m)
            users.exp += exp
            users.money += money
            users.limit += limit
            users.lastclaim = new Date() * 1
         } else {
            conn.reply(m.chat, `You have claimed, you can reclaim in the next day.\n\nTimeout : [ ${Func.toTime(timeout)} ]`, m)
         }
      } catch (e) {
         conn.reply(m.chat, Func.jsonFormat(e), m)
      }
   },
   register: true
}