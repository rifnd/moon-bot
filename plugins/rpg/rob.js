module.exports = {
   help: ['merampok'],
   use: 'mention',
   tags: ['rpg'],
   command: /^merampok$/,
   run: async (m, {
      conn,
      Func
   }) => {
      try {
         let dapat = (Math.floor(Math.random() * 100000))
         let nomors = m.sender
         let who
         if (m.isGroup) who = m.mentionedJid[0]
         else who = m.chat
         if (!who) return conn.reply(m.chat, Func.example(usedPrefix, command, '@tag'), m)
         if (typeof global.db.data.users[who] == 'undefined') return conn.reply(m.chat, Func.texted('bold', `🚩 User tidak terdaftar di database.`), m)
         let __timers = (new Date - global.db.data.users[m.sender].lastrob)
         let _timers = (3600000 - __timers)
         let timers = Func.toTime(_timers)
         let users = global.db.data.users
         if (new Date - global.db.data.users[m.sender].lastrob > 3600000) {
            if (10000 > users[who].money) return conn.reply(m.chat, Func.texted('bold', `🚩 Target tidak mempunyai uang.`), m)
            users[who].money -= dapat * 1
            users[m.sender].money += dapat * 1
            global.db.data.users[m.sender].lastrob = new Date * 1
            conn.reply(m.chat, `Berhasil Merampok Money Target Sebesar ${dapat}`, m)
         } else conn.reply(m.chat, `Kamu sudah merampok dan berhasil sembunyi, tunggu ${timers} untuk merampok lagi`, m)
      } catch (e) {
         return conn.reply(m.chat, Func.jsonFormat(e), m)
      }
   },
   limit: true,
   rpg: true,
   group: true
}