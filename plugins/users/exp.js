module.exports = {
   help: ['exp'],
   tags: ['user'],
   command: /^(exp)$/i,
   run: async (m, {
      conn,
      Func
   }) => {
      let user = global.db.data.users[m.sender]
      if (user.exp < 1) return conn.reply(m.chat, `🚩 You have no exp.`, m)
      conn.reply(m.chat, `◦ Exp : [ *${Func.formatNumber(user.exp)}* ]`, m)
   }
}