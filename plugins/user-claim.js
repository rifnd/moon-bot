module.exports = {
   run: async (m, {
      conn,
      users,
      Func
   }) => {
      try {
         let timeClaim = 86400000
         let claimed = new Date(users.lastclaim + timeClaim)
         let timeout = claimed - new Date()
         let exp = Func.randomInt(1, 1000)
         let money = Func.randomInt(1, 1000)
         if (new Date - users.lastclaim > timeClaim) {
            conn.reply(m.chat, Func.texted('bold', `🎉 Congratulations!, you got +${Func.formatNumber(exp)} exp & +${Func.formatNumber(money)} money`), m)
            users.exp += exp
            users.money += money
            users.lastclaim = new Date() * 1
         } else {
            conn.reply(m.chat, `*You have claimed, you can reclaim in the next day.*\n\n*Timeout : [ ${Func.toTime(timeout)} ]*`, m)
         }
      } catch (e) {
         conn.reply(m.chat, Func.jsonFormat(e), m)
      }
   },
   help: ['claim'],
   tags: ['user'],
   command: /^(daily|claim)$/i
}