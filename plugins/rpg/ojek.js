module.exports = {
   help: ['ojek'],
   tags: ['rpg'],
   command: /^(ojek|ngojek|gojek)$/i,
   run: async (m, {
      conn,
      Func
   }) => {
      try {
         let __timers = (new Date - global.db.data.users[m.sender].lastngojek)
         let _timers = (300000 - __timers)
         let order = global.db.data.users[m.sender].ojek
         let timers = Func.toTime(_timers)
         let user = global.db.data.users[m.sender]

         if (new Date - global.db.data.users[m.sender].lastngojek > 300000) {
            let randomaku1 = `${Math.floor(Math.random() * 10)}`
            let randomaku2 = `${Math.floor(Math.random() * 10)}`
            let randomaku4 = `${Math.floor(Math.random() * 5)}`
            let randomaku3 = `${Math.floor(Math.random() * 10)}`
            let randomaku5 = `${Math.floor(Math.random() * 10)}`.trim()

            let rbrb1 = (randomaku1 * 2)
            let rbrb2 = (randomaku2 * 10)
            let rbrb3 = (randomaku3 * 1)
            let rbrb4 = (randomaku4 * 15729)
            let rbrb5 = (randomaku5 * 120)

            var zero1 = `${rbrb1}`
            var zero2 = `${rbrb2}`
            var zero3 = `${rbrb3}`
            var zero4 = `${rbrb4}`
            var zero5 = `${rbrb5}`

            var dimas = `Mendapatkan Orderan...`

            var dimas2 = `
🚶🛵⬛⬛⬛⬛⬛⬛⬛⬛
⬛⬜⬜⬜⬛⬜⬜⬜⬛⬛
⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛
🏘️🏘️🏘️🏘️🌳  🌳 🏘️       
     
➕ Mengantar ke tujuan....`

            var dimas3 = `
⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛
⬛⬜⬜⬛⬛⬜⬜⬜⬛⬛
⬛⬛⬛⬛⬛⬛⬛🛵⬛⬛
🏘️🏘️🏘️🏘️🌳  🌳 🏘️       
     
➕ Sampai di tujuan...`

            var dimas4 = `💹 Menerima gaji....`

            var hsl = `
~ Hasil NgOjek

◦ Money = +${Func.formatNumber(zero4)}
◦ Exp = +${Func.formatNumber(zero5)}	 

Order Selesai = +1
Total Order Sebelumnya = ${order}

> ${global.footer}`

            var dimas5 = `*Waktunya ngojek lagi...*`

            global.db.data.users[m.sender].money += rbrb4
            global.db.data.users[m.sender].exp += rbrb5
            global.db.data.users[m.sender].ojek += 1

            setTimeout(() => {
               setTimeout(() => {
                  m.reply(`${dimas5}`)
               }, 79200000)

               m.reply(`${hsl}`)
            }, 27000)

            setTimeout(() => {
               m.reply(`${dimas4}`)
            }, 25000)

            setTimeout(() => {
               m.reply(`${dimas3}`)
            }, 20000)

            setTimeout(() => {
               m.reply(`${dimas2}`)
            }, 15000)

            setTimeout(() => {
               m.reply(`${dimas}`)
            }, 10000)

            setTimeout(() => {
               m.reply('Mencari Pelanggan...')
            }, 0)
            user.lastngojek = new Date * 1
         } else m.reply(`Sepertinya Kamu sudah kecapekan silahkan istirahat dulu sekitar\n*${timers}*`)
      } catch (e) {
         return conn.reply(m.chat, Func.jsonFormat(e), m)
      }
   },
   limit: true,
   rpg: true,
   group: true
}