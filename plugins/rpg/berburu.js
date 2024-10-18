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
      let lastHuntTime = db.data.users[m.sender].lastberbru || 0
      let cooldown = 24 * 60 * 60 * 1000 // 1 day cooldown

      if (new Date() - lastHuntTime < cooldown) {
         let remainingCooldown = cooldown - (new Date() - lastHuntTime)
         let remainingTime = Func.toTime(remainingCooldown)

         m.reply(`Mohon menunggu sebelum dapat berburu lagi.\n\nTimeout : [ *${remainingTime}* ]`)
         return
      }

      let habitats = {
         'Hutan 🌿': ['🐃 Banteng', '🐅 Harimau', '🐐 Kambing', '🐒 Monyet', '🐗 Babihutan', '🐖 Babi'],
         'Sabana 🦁': ['🐘 Gajah', '🐐 Kambing', '🐄 Sapi', '🐖 Babi'],
         'Taman Panda 🐼': ['🐼 Panda'],
         'Danau 🐊': ['🐊 Buaya', '🐄 Sapi', '🐖 Babi'],
         'Lembah 🐂': ['🐂 Kerbau', '🐄 Sapi', '🐖 Babi'],
         'Kebun 🐔': ['🐔 Ayam']
      }

      let results = {}

      m.reply(`🏞️ *${conn.getName(m.sender)} Sedang Berburu 🌿*\n\n`)

      setTimeout(() => {
         let res = `*🏞️ HASIL BERBURU ${conn.getName(m.sender)} 🏞️*\n\n`
         for (let habitat in habitats) {
            res += `*${habitat}*\n`
            for (let animal of habitats[habitat]) {
               let count = Math.floor(Math.random() * 100) + 1
               res += `${animal}: ${count} ekor\n`
               let animalName = animal.split(' ')[1].toLowerCase()
               if (!results[animalName]) results[animalName] = 0
               results[animalName] += count
            }
            res += '\n'
         }
         res += `*${author}* 🏕️`

         let user = db.data.users[m.sender]
         for (let animal in results) {
            user[animal] += results[animal]
         }

         conn.reply(m.chat, res, null)
         user.lastberbru = new Date() * 1
      }, 5000)
   },
   limit: true,
   rpg: true,
   group: true
}