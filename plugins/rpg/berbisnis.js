module.exports = {
   help: ['berbisnis'],
   tags: ['rpg'],
   command: /^(berbisnis)$/i,
   run: async (m, {
      conn,
      usedPrefix,
      env,
      Func
   }) => {
      let who1 = m.mentionedJid[0]
      let who2 = m.mentionedJid[1]
      let who3 = m.mentionedJid[2]

      if (text.split(' ').length < 3) return m.reply('Minimal tag 3 member!')
      if (!text) return conn.reply(m.chat, Func.example(usedPrefix, command, '@tag @tag @tag'), m)
      if (typeof db.data.users[who1] == 'undefined' || typeof db.data.users[who2] == 'undefined' || typeof db.data.users[who2] == 'undefined' || typeof db.data.users[who3] == 'undefined') return m.reply(Func.texted('bold', 'Di antara target yang kamu tag, mereka tidak terdaftar di database.'))
      let __timers = new Date() - db.data.users[m.sender].lastbisnis
      let _timers = 86400000 - __timers
      let timers = Func.toTime(_timers)
      let users = db.data.users
      let name = m.sender
      if (1000 > users[who1].money || 1000 > users[who2].money || 1000 > users[who3].money) return m.reply(Func.texted('bold', 'Di antara target yang kamu tag, mereka tidak punya modal, harap masukkan modal terlebih dahulu 10000'))
      if (9999 > users[m.sender].money) return m.reply(Func.texted('bold', 'kamu tidak memiliki modal harap masukkan modal 10000'))
      if (new Date() - db.data.users[m.sender].lastbisnis > 86400000) {
         let dapat = Func.randomInt(env.min_reward, env.max_reward)
         let untung = Func.randomInt(env.min_reward, env.max_reward)
         let rugi = Func.randomInt(env.min_reward, env.max_reward)
         db.data.users[m.sender].money -= dapat * 1
         db.data.users[who1].money -= dapat * 1
         db.data.users[who2].money -= dapat * 1
         db.data.users[who3].money -= dapat * 1

         conn.reply(m.chat, `Mohon tunggu..\n\n@${m.sender.split`@`[0]}\n@${who1.split`@`[0]}\n@${who2.split`@`[0]}\n@${who3.split`@`[0]}\nSedang berbisnis.. 😅\n\n*Kalian semua meletakkan modal masing-masing -${dapat} 😅*\n@${name.split`@`[0]}\n@${who1.split`@`[0]}\n@${who2.split`@`[0]}\n@${who3.split`@`[0]}`, m, {
            mentions: [m.mentionedJid]
         })
         setTimeout(() => {
            let bis = `Selamat statistik bisnis kalian meningkat\n\nMasing-masing mendapatkan:\n@${name.split`@`[0]} : *+${(users[m.sender].money += untung * 1)} Money*\n@${who1.split`@`[0]} : *+${(users[who1].money += untung * 1)} Money*\n@${who2.split`@`[0]} : *+${(users[who2].money += untung * 1)} Money*\n@${who3.split`@`[0]} : *+${(users[who3].money += untung * 1)} Money*`
            conn.reply(m.chat, bis, m, {
               mentions: [bis]
            })
         }, 60000)
         setTimeout(() => {
            let bis = `Waahhh.. statistik bisnis kalian menurun\n\nMasing-masing minus:\n@${name.split`@`[0]} : *-${(users[m.sender].money -= rugi * 1)} Money*\n@${who1.split`@`[0]} : *-${(users[who1].money -= rugi * 1)} Money*\n@${who2.split`@`[0]} : *-${(users[who2].money -= rugi * 1)} Money*\n@${who3.split`@`[0]} : *-${(users[who3].money -= rugi * 1)} Money*`
            conn.reply(m.chat, bis, m, {
               mentions: [bis]
            })
         }, 14400000)
         setTimeout(() => {
            let bis = `Selamat statistik bisnis kalian meningkat\n\nMasing-masing mendapatkan:\n@${name.split`@`[0]} : *+${(users[m.sender].money += untung * 1)} Money*\n@${who1.split`@`[0]} : *+${(users[who1].money += untung * 1)} Money*\n@${who2.split`@`[0]} : *+${(users[who2].money += untung * 1)} Money*\n@${who3.split`@`[0]} : *+${(users[who3].money += untung * 1)} Money*`
            conn.reply(m.chat, bis, m, {
               mentions: [bis]
            })
         }, 28800000)
         setTimeout(() => {
            let bis = `Selamat statistik bisnis kalian meningkat\n\nMasing-masing mendapatkan:\n@${name.split`@`[0]} : *+${(users[m.sender].money += untung * 1)} Money*\n@${who1.split`@`[0]} : *+${(users[who1].money += untung * 1)} Money*\n@${who2.split`@`[0]} : *+${(users[who2].money += untung * 1)} Money*\n@${who3.split`@`[0]} : *+${(users[who3].money += untung * 1)} Money*`
            conn.reply(m.chat, bis, m, {
               mentions: [bis]
            })
         }, 43200000)
         setTimeout(() => {
            let bis = `Mohon tunggu kak..\n\n@${name.split`@`[0]}\n@${who1.split`@`[0]}\n@${who2.split`@`[0]}\n@${who3.split`@`[0]}\nSedang berbisnis.. 😅\n\n*Kalian semua meletakkan modal masing-masing -${dapat} 😅*\n@${name.split`@`[0]}\n@${who1.split`@`[0]}\n@${who2.split`@`[0]}\n@${who3.split`@`[0]}`
            conn.reply(m.chat, bis, m, {
               mentions: [bis]
            })
         }, 57600000)
         setTimeout(() => {
            let bis = `Selamat statistik bisnis kalian meningkat\n\nMasing-masing mendapatkan:\n@${name.split`@`[0]} : *+${(users[m.sender].money += untung * 1)} Money*\n@${who1.split`@`[0]} : *+${(users[who1].money += untung * 1)} Money*\n@${who2.split`@`[0]} : *+${(users[who2].money += untung * 1)} Money*\n@${who3.split`@`[0]} : *+${(users[who3].money += untung * 1)} Money*`
            conn.reply(m.chat, bis, m, {
               mentions: [bis]
            })
         }, 72000000)
      } else m.reply(`Kamu Sudah Berbisnis , tunggu ${timers} lagi..`)
   },
   limit: true,
   rpg: true,
   group: true
}