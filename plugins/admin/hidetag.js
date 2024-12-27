module.exports = {
   help: ['hidetag'],
   use: 'text',
   tags: ['admin'],
   run: async (m, {
      conn,
      usedPrefix,
      command,
      text,
      participants,
      Func
   }) => {
      let users = participants.map(u => u.id)
      await conn.reply(m.chat, text, null, {
         mentions: users
      })
   },
   group: true,
   admin: true,
   botAdmin: true
}