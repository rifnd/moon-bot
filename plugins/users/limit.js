module.exports = {
   help: ['limit'],
   tags: ['user'],
   command: /^(limit)$/i,
   run: async (m, {
      conn,
      usedPrefix,
      Func
   }) => {
      let user = global.db.data.users[m.sender]
      if (user.limit < 1) return conn.reply(m.chat, `🚩 Your bot usage has reached the limit\n\nTo get more limits, upgrade to a premium plan send *${usedPrefix}premium*`, m)
      conn.reply(m.chat, `🍟 Your limit : [ *${Func.formatNumber(user.limit)}* ]${!user.premium ? `\n\nTo get more limits, upgrade to a premium plan send *${usedPrefix}premium*` : ''}`, m)
   }
}