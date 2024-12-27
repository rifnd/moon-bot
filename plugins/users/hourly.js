module.exports = {
   help: ['hourly'],
   tags: ['user'],
   run: async (m, {
      conn,
      users,
      Func
   }) => {
      try {
         let timeClaim = 3600000
         let claimed = new Date(users.lasthourly + timeClaim)
         let timeout = claimed - new Date()
         let exp = Func.randomInt(1000, 5000)
         let money = Func.randomInt(1000, 5000)
         if (new Date - users.lasthourly > timeClaim) {
            conn.reply(m.chat, `Congratulations!, you got\n\n+ ${Func.formatNumber(exp)} exp\n+ ${Func.formatNumber(money)} money`, m)
            users.exp += exp
            users.money += money
            users.lasthourly = new Date() * 1
         } else {
            conn.reply(m.chat, `You have claimed, you can reclaim in the next hour.\n\nTimeout : [ ${Func.toTime(timeout)} ]`, m)
         }
      } catch (e) {
         conn.reply(m.chat, Func.jsonFormat(e), m)
      }
   }
}