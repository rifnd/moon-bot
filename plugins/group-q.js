module.exports = {
   run: async (m, {
      conn,
      Func
   }) => {
      if (!m.quoted) return conn.reply(m.chat, Func.texted('bold', `🚩 Reply to message that contain quoted.`), m)
      let q = await m.getQuotedObj()
      if (!q.quoted) return conn.reply(m.chat, Func.texted('bold', `🚩 Message does not contain quoted.`), m)
      await q.quoted.copyNForward(m.chat, true)
   },
   help: ['q'],
   use: 'reply chat',
   tags: ['group'],
   command: /^(q|quoted)$/i
}