module.exports = {
   help: ['berdagang'],
   tags: ['rpg'],
   command: /^(berdagang)$/i,
   run: async (m, {
      conn,
      usedPrefix,
      env,
      Func
   }) => {
      let dapat = (Math.floor(Math.random() * 5000))
      let who
      if (m.isGroup) who = m.mentionedJid[0]
      else who = m.chat
      if (!who) return m.reply(Func.texted('bold', 'Tag salah satu lah, yang kamu ingin berdagang bareng'))
      if (typeof db.data.users[who] == 'undefined') return m.reply(Func.texted('bold', 'Pengguna tidak ada didalam database'))
      let __timers = (new Date - db.data.users[m.sender].lastdagang)
      let _timers = (28800000 - __timers)
      let timers = clockString(_timers)
      let users = db.data.users
      let username = conn.getName(who)
      if (new Date - db.data.users[m.sender].lastdagang > 28800000) {
         if (4999 > users[who].money) return m.reply(Func.texted('bold', 'Target tidak memiliki modal harap masukkan modal 5000.'))
         if (4999 > users[m.sender].money) return m.reply(Func.texted('bold', 'Kamu tidak memiliki modal harap masukkan modal 5000.'))
         users[who].money -= dapat * 1
         users[m.sender].money -= dapat * 1
         db.data.users[m.sender].lastdagang = new Date * 1
         conn.reply(m.chat, `Mohon tunggu kak..\nKamu dan @${who.split`@`[0]} sedang berdagang.. 😅\n\nKamu dan @${who.split`@`[0]} meletakkan modal -${dapat} 😅`, m)
         setTimeout(() => {
            conn.reply(m.chat, `Selamat kamu dan @${who.split`@`[0]} mendapatkan money..\n\nPenghasilan dagang kamu didapatkan +5000\n${users[m.sender].money += 5000} Money kamu\n\nPenghasilan dagang @${who.split`@`[0]} didapatkan +5000\n${users[who].money += 5000} Money @${who.split`@`[0]}`, m)
         }, 3600000)
         setTimeout(() => {
            conn.reply(m.chat, `Selamat kamu dan @${who.split`@`[0]} mendapatkan money..\n\nPenghasilan dagang kamu didapatkan +5000\n${users[m.sender].money += 5000} Money kamu\n\nPenghasilan dagang @${who.split`@`[0]} didapatkan +5000\n${users[who].money += 5000} Money @${who.split`@`[0]}`, m)
         }, 7200000)
         setTimeout(() => {
            conn.reply(m.chat, `Selamat kamu dan @${who.split`@`[0]} mendapatkan money..\n\nPenghasilan dagang kamu didapatkan +5000\n${users[m.sender].money += 5000} Money kamu\n\nPenghasilan dagang @${who.split`@`[0]} didapatkan +5000\n${users[who].money += 5000} Money @${who.split`@`[0]}`, m)
         }, 10800000)
         setTimeout(() => {
            conn.reply(m.chat, `Selamat kamu dan @${who.split`@`[0]} mendapatkan money..\n\nPenghasilan dagang kamu didapatkan +5000\n${users[m.sender].money += 5000} Money kamu\n\nPenghasilan dagang @${who.split`@`[0]} didapatkan +5000\n${users[who].money += 5000} Money @${who.split`@`[0]}`, m)
         }, 14400000)
         setTimeout(() => {
            conn.reply(m.chat, `Selamat kamu dan @${who.split`@`[0]} mendapatkan money..\n\nPenghasilan dagang kamu didapatkan +5000\n${users[m.sender].money += 5000} Money kamu\n\nPenghasilan dagang @${who.split`@`[0]} didapatkan +5000\n${users[who].money += 5000} Money @${who.split`@`[0]}`, m)
         }, 18000000)
         setTimeout(() => {
            conn.reply(m.chat, `Selamat kamu dan @${who.split`@`[0]} mendapatkan money..\n\nPenghasilan dagang kamu didapatkan +5000\n${users[m.sender].money += 5000} Money kamu\n\nPenghasilan dagang @${who.split`@`[0]} didapatkan +5000\n${users[who].money += 5000} Money @${who.split`@`[0]}`, m)
         }, 21600000)
         setTimeout(() => {
            conn.reply(m.chat, `Selamat kamu dan @${who.split`@`[0]} mendapatkan money..\n\nPenghasilan dagang kamu didapatkan +5000\n${users[m.sender].money += 5000} Money kamu\n\nPenghasilan dagang @${who.split`@`[0]} didapatkan +5000\n${users[who].money += 5000} Money @${who.split`@`[0]}`, m)
         }, 25200000)
         setTimeout(() => {
            conn.reply(m.chat, `Selamat kamu dan @${who.split`@`[0]} mendapatkan money..\n\nPenghasilan dagang kamu didapatkan +10000\n${users[m.sender].money += 10000} Money kamu\n\nPenghasilan dagang @${who.split`@`[0]} didapatkan +10000\n${users[who].money += 10000} Money @${who.split`@`[0]}`, m)
         }, 28800000)
      } else conn.reply(m.chat, `Anda Sudah Berdagang , tunggu ${timers} lagi..`, m)
   },
   limit: true,
   rpg: true,
   group: true
}