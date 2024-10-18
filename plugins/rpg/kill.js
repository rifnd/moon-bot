module.exports = {
   help: ['membunuh'],
   use: 'mention',
   tags: ['rpg'],
   command: /^membunuh|kill$/,
   run: async (m, {
      conn,
      Func
   }) => {
      try {
         let dapat = (Math.floor(Math.random() * 100000))
         let healtu = (Math.floor(Math.random() * 100))
         let nomors = m.sender
         let who
         if (m.isGroup) who = m.mentionedJid[0]
         else who = m.chat
         if (!who) return conn.reply(m.chat, Func.example(usedPrefix, command, '@tag'), m)
         if (typeof global.db.data.users[who] == 'undefined') return conn.reply(m.chat, Func.texted('bold', `🚩 User tidak terdaftar di database.`), m)
         let __timers = (new Date - global.db.data.users[m.sender].lastbunuhi)
         let _timers = (3600000 - __timers)
         let timers = Func.toTime(_timers)
         let users = global.db.data.users
         if (new Date - global.db.data.users[m.sender].lastbunuhi > 3600000) {
            if (10 > users[who].health) return conn.reply(m.chat, Func.texted('bold', `🚩 Target tidak mempunyai health.`), m)
            if (100 > users[who].money) return conn.reply(m.chat, Func.texted('bold', `🚩 Target tidak mempunyai uang.`), m)
            users[who].health -= healtu * 1
            users[who].money -= dapat * 1
            users[m.sender].money += dapat * 1
            global.db.data.users[m.sender].lastbunuhi = new Date * 1
            m.reply(`Target berhasil di bunuh dan kamu mengambil money target sebesar\n${dapat} Money\nDarah target berkurang -${healtu} Healt`)
         } else conn.reply(m.chat, `Kamu sudah membunuh orang dan berhasil sembunyi , tunggu ${timers} untuk membunuhnya lagi`, m)
      } catch (e) {
         return conn.reply(m.chat, Func.jsonFormat(e), m)
      }
   },
   limit: true,
   rpg: true,
   group: true
}