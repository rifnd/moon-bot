module.exports = {
   help: ['hourly'],
   tags: ['user'],
   command: /^(hourly)$/i,
   run: async (m, {
      conn,
      users,
      Func
   }) => {
      try {
         let timeClaim = 86400000
         let claimed = new Date(users.lasthourly + timeClaim)
         let timeout = claimed - new Date()
         let exp = Func.randomInt(100, 1000)
         let money = Func.randomInt(100, 1000)
         if (new Date - users.lasthourly > timeClaim) {
            conn.reply(m.chat, Func.texted('bold', `🎉 Congratulations!, you got +${Func.formatNumber(exp)} exp & +${Func.formatNumber(money)} money.`), m)
            users.exp += exp
            users.money += money
            users.lasthourly = new Date() * 1
         } else {
            conn.reply(m.chat, `*You have claimed, you can reclaim in the next hour.*\n\n*Timeout : [ ${Func.toTime(timeout)} ]*`, m)
         }
      } catch (e) {
         conn.reply(m.chat, Func.jsonFormat(e), m)
      }
   }
}