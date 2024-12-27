module.exports = {
   help: ['changename'],
   use: 'name',
   tags: ['owner'],
   run: async (m, {
      conn,
      usedPrefix,
      command,
      text,
      Func
   }) => {
      try {
         if (!text) return conn.reply(m.chat, Func.example(usedPrefix, command, 'moon bot'), m)
         if (text.length > 25) return conn.reply(m.chat, Func.texted('bold', `🚩 Text is too long, maximum 25 characters.`), m)
         conn.authState.creds.me.name = text
         await global.db.write()
         return conn.reply(m.chat, Func.texted('bold', `✅ Successfully to change name`), m)
      } catch {
         return conn.reply(m.chat, Func.texted('bold', `🚩 Failed to change name.`), m)
      }
   },
   owner: true
}