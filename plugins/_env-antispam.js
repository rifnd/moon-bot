module.exports = {
   async before(m, {
      conn,
      users,
      chats,
      isAdmin,
      isBotAdmin,
      isOwner,
      setting,
      env
   }) {
      try {
         let unban = new Date(users.ban_temporary + env.timeout)
         if (setting.antispam && new Date - users.ban_temporary > env.timeout) {
            if (!users.banned && !m.fromMe) {
               users.spam += 1
               let spam = users.spam
               if (spam >= 2) setTimeout(() => {
                  users.spam = 0
               }, env.cooldown * 1000)
               if (users.ban_times >= 3) return conn.reply(m.chat, `🚩 You are permanently banned because you have been temporarily banned 3 times.`, m).then(() => {
                  users.banned = true
                  users.ban_temporary = 0
                  users.ban_times = 0
               })
               if (m.isGroup && spam == 4) return conn.reply(m.chat, `🚩 System detects you are spamming, please cooldown for *${env.cooldown} seconds*.`, m)
               if (m.isGroup && spam >= 5) return conn.reply(m.chat, `🚩 You were temporarily banned for ${((env.timeout / 1000) / 60)} minutes cause you over spam.`, m).then(() => {
                  users.ban_temporary = new Date() * 1
                  users.ban_times += 1
                  if (!isOwner && chats) {
                     if (new Date() * 1 - chats.command > env.cooldown * 1000) {
                        chats.command = new Date() * 1
                     } else {
                        if (!m.fromMe) return
                     }
                  }
               })
               if (!m.isGroup && spam == 4) return conn.reply(m.chat, `🚩 System detects you are spamming, please cooldown for *${env.cooldown} seconds*.`, m)
               if (!m.isGroup && spam >= 5) return conn.reply(m.chat, `🚩 You were temporarily banned for ${((env.timeout / 1000) / 60)} minutes cause you over spam.`, m).then(() => {
                  users.ban_temporary = new Date() * 1
                  users.ban_times += 1
               })
            }
         } else return
      } catch (e) {
         console.log(e)
      }
      return true
   }
}