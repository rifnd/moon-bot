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
         let now = Date.now()
         let unban = users.ban_temporary + env.timeout
         if (setting.antispam && now > unban) {
            if (!users.banned && !m.fromMe) {
               users.spam += 1
               let spam = users.spam
               if (spam >= 2) {
                  setTimeout(() => {
                     users.spam = 0
                  }, env.cooldown * 1000)
               }
               if (users.ban_times >= 3) {
                  users.banned = true
                  users.ban_temporary = 0
                  users.ban_times = 0
                  return conn.reply(m.chat, `🚩 You are permanently banned because you have been temporarily banned 3 times.`, m)
               }
               if (spam === 4) {
                  return conn.reply(m.chat, `🚩 System detects you are spamming, please cooldown for *${env.cooldown} seconds*.`, m)
               }
               if (spam >= 5) {
                  users.ban_temporary = now
                  users.ban_times += 1
                  return conn.reply(m.chat, `🚩 You were temporarily banned for ${((env.timeout / 1000) / 60)} minutes due to excessive spam.`, m)
               }
               if (m.isGroup && !isOwner && chats) {
                  if (now - chats.command > env.cooldown * 1000) {
                     chats.command = now
                  } else {
                     return
                  }
               }
            }
         }
      } catch (e) {
         console.log(e)
      }
      return true
   }
}