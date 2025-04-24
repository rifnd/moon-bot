module.exports = {
   async function(m, {
      conn,
      env,
      Func
   }) {
      try {
         setInterval(async () => {
            let day = 86400000 * 3, now = new Date() * 1
            Object.values(global.db.users).filter(v => now - v.lastseen > day && !v.premium && !v.banned && v.exp < 1000000).map(v => {
               let user = global.db.users[v.jid]
               if (user) delete global.db.users[v.jid]
            })
            Object.values(global.db.chats).filter(v => now - v.lastseen > day).map(v => {
               let chat = global.db.chats[v.jid]
               if (chat) delete global.db.chats[v.jid]
            })
            Object.values(global.db.groups).filter(v => now - v.activity > day).map(v => {
               let group = global.db.groups[v.jid]
               if (group) delete global.db.groups[v.jid]
            })
         }, 60_000)
      } catch (e) {
         return conn.reply(m.chat, Func.jsonFormat(e), m)
      }
   },
   error: false
}