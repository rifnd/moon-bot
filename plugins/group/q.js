module.exports = {
   help: ['q'],
   command: ['quoted'],
   use: 'reply chat',
   tags: ['group'],
   run: async (m, {
      conn,
      Func
   }) => {
      try {
         if (!m.quoted) return conn.reply(m.chat, `Reply to message that contain quoted.`, m)
         let q = await m.getQuotedObj()
         if (!q.quoted) return conn.reply(m.chat, `Message does not contain quoted.`, m)
         await q.quoted.copyNForward(m.chat, true)
      } catch (e) {
         console.log(e)
         conn.reply(m.chat, `Can't load message.`, m)
      }
   }
}