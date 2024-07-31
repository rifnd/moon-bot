module.exports = {
   run: async (m, {
      conn,
      usedPrefix,
      Func
   }) => {
      let user = global.db.data.users[m.sender]
      if (user.money < 1) return conn.reply(m.chat, `🚩 You have no money.`, m)
      conn.reply(m.chat, `◦ Money : [ *${Func.formatNumber(user.money)}* ]`, m)
   },
   help: ['money'],
   tags: ['user'],
   command: /^(money)$/i
}