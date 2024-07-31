module.exports = {
   run: async (m, {
      conn,
      text,
      Func
   }) => {
      try {
         let user = global.db.data.users[m.sender]
         user.afk = +new Date
         user.afkReason = text
         let tag = m.sender.split`@`[0]
         return conn.reply(m.chat, Func.texted('bold', `🚩 @${tag} is now AFK!`), m)
      } catch {
         conn.reply(m.chat, global.status.error, m)
      }
   },
   help: ['afk'],
   use: 'reason (optional)',
   tags: ['group'],
   command: /^(afk)$/i
}