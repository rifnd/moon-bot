module.exports = {
   help: ['berkebun'],
   tags: ['rpg'],
   command: /^(berkebun)$/i,
   run: async (m, {
      conn,
      usedPrefix,
      text,
      Func
   }) => {
      const timeout = 28800000
      let apelu = db.data.users[m.sender].bibitapel
      let angguru = db.data.users[m.sender].bibitanggur
      let manggau = db.data.users[m.sender].bibitmangga
      let pisangu = db.data.users[m.sender].bibitpisang
      let jeruku = db.data.users[m.sender].bibitjeruk
      let time = db.data.users[m.sender].lastberkebon + 28800000
      if (apelu == 0 || angguru == 0 || manggau == 0 || pisangu == 0 || jeruku == 0) return m.reply(`*Pastikan kamu memiliki semua bibit*\n*Seperti Bibit Apel, Bibit Mangga, Bibit Jeruk, Bibit Pisang, Bibit Anggur*\n\nKetik :\n${usedPrefix}shop buy bibitmangga 500\n\n*List*\nbibitmangga\nbibitanggur\nbibitpisang\nbibitjeruk\nbibitapel`)
      if (new Date - db.data.users[m.sender].lastberkebon < 28800000) throw `Anda sudah menanam\nMohon tunggu hasil panenmu\nTunggu selama ${msToTime(time - new Date())} lagi`
      if (db.data.users[m.sender].bibitmangga > 499) {
         if (db.data.users[m.sender].bibitapel > 499) {
            if (db.data.users[m.sender].bibitpisang > 499) {
               if (db.data.users[m.sender].bibitjeruk > 499) {
                  if (db.data.users[m.sender].bibitanggur > 499) {
                     let pisangpoin = `${Math.floor(Math.random() * 500)}`.trim()
                     let anggurpoin = `${Math.floor(Math.random() * 500)}`.trim()
                     let manggapoin = `${Math.floor(Math.random() * 500)}`.trim()
                     let jerukpoin = `${Math.floor(Math.random() * 500)}`.trim()
                     let apelpoin = `${Math.floor(Math.random() * 500)}`.trim()
                     db.data.users[m.sender].pisang += pisangpoin * 1
                     db.data.users[m.sender].anggur += anggurpoin * 1
                     db.data.users[m.sender].mangga += manggapoin * 1
                     db.data.users[m.sender].jeruk += jerukpoin * 1
                     db.data.users[m.sender].apel += apelpoin * 1
                     db.data.users[m.sender].tiketcoin += 1
                     db.data.users[m.sender].bibitpisang -= 500
                     db.data.users[m.sender].bibitanggur -= 500
                     db.data.users[m.sender].bibitmangga -= 500
                     db.data.users[m.sender].bibitjeruk -= 500
                     db.data.users[m.sender].bibitapel -= 500
                     db.data.users[m.sender].lastberkebon = new Date * 1
                     m.reply(`Selamat kamu mendapatkan : \n+${pisangpoin} Pisang\n+${manggapoin} Mangga\n+${anggurpoin} Anggur\n+${jerukpoin} Jeruk\n+${apelpoin} Apel\n+1 Tiketcoin`)
                     setTimeout(() => {
                        //conn.reply(m.chat, `Waktunya berkebon lagi kak 😅`, m)
                     }, timeout)
                  } else m.reply(`Pastikan bibit anggur kamu *500* untuk bisa berkebon`)
               } else m.reply(`Pastikan bibit jeruk kamu *500* untuk bisa berkebon`)
            } else m.reply(`Pastikan bibit pisang kamu *500* untuk bisa berkebon`)
         } else m.reply(`Pastikan bibit apel kamu *500* untuk bisa berkebon`)
      } else m.reply(`Pastikan bibit mangga kamu *500* untuk bisa berkebon`)
   },
   limit: true,
   rpg: true,
   group: true
}