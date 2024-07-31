module.exports = {
   run: async (m, {
      conn,
      args,
      Func
   }) => {
      if (!args || !args[0]) return conn.reply(m.chat, Func.texted('bold', `🚩 Enter argument close or open.`), m)
      if (args[0] == 'open') {
         await conn.groupSettingUpdate(m.chat, 'not_announcement')
      } else if (args[0] == 'close') {
         await conn.groupSettingUpdate(m.chat, 'announcement')
      }
   },
   help: ['group'],
   use: 'open / close',
   tags: ['admin'],
   command: /^(group)$/i,
   group: true,
   admin: true,
   botAdmin: true
}