module.exports = {
   help: ['listonline'],
   tags: ['group'],
   run: async (m, {
      conn,
      store,
      Func
   }) => {
      let online = [...Object.keys(store.presences[m.chat])]
      if (online.length < 1) return m.reply(Func.texted('bold', `🚩 The system does not detect members who are online.`))
      conn.reply(m.chat, online.map(v => '◦  @' + v.replace(/@.+/, '')).join('\n'), m)
   },
   group: true
}