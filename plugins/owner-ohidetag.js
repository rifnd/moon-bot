module.exports = {
   run: async (m, {
      conn,
      usedPrefix,
      command,
      args,
      participants,
      Func
   }) => {
      let users = participants.map(u => u.id)
      await conn.reply(m.chat, text, null, {
         mentions: users
      })
   },
   help: ['ohidetag'],
   use: 'text',
   tags: ['owner'],
   command: /^(ohidetag)$/i,
   owner: true,
   group: true
}