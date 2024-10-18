module.exports = {
   help: ['adventure'],
   tags: ['rpg'],
   command: /^(adventure)$/i,
   run: async (m, {
      conn,
      usedPrefix,
      users,
      Func
   }) => {
      try {
         let __timers = (new Date - users.lastadventure)
         let _timers = (3600000 - __timers)
         let timers = Func.toTime(_timers)
         if (users.health > 79) {
            if (new Date - users.lastadventure > 3600000) {
               let armor = users.armor
               let rubah = users.rubah
               let kuda = users.kuda
               let kucing = users.kucing
               let serigala = users.serigala
               let _health = `${Math.floor(Math.random() * 101)}`.trim()
               let health = (_health * 1)
               let exp = `${Math.floor(Math.random() * 1000)}`.trim()
               let uang = `${Math.floor(Math.random() * 10000)}`.trim()
               let _potion = ['1', '2', '3']
               let potion = _potion[Math.floor(Math.random() * _potion.length)]
               let _sampah = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31', '32', '33', '34', '35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46', '47', '48', '49', '50']
               let sampah = _sampah[Math.floor(Math.random() * _sampah.length)]
               let _diamond = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']
               let diamond = _diamond[Math.floor(Math.random() * _diamond.length)]
               let _common = ['1', '2', '3']
               let common = _common[Math.floor(Math.random() * _common.length)]
               let _uncommon = ['1', '2', '1', '2']
               let uncommon = _uncommon[Math.floor(Math.random() * _uncommon.length)]
               let _mythic = `${pickRandom(['1', '3', '1', '1', '2'])}`
               let mythic = (_mythic * 1)
               let _legendary = `${pickRandom(['1', '3', '1', '1', '2'])}`
               let legendary = (_legendary * 1)
               let itemrand = [`*Selamat anda mendapatkan item rare yaitu*\n${mythic} Mythic Crate`, `*Selamat kamu mendapatkan item rare yaitu*\n${legendary} Legendary Crate`]
               let rendem = itemrand[Math.floor(Math.random() * itemrand.length)]
               let str = `Nyawa kamu berkurang sebanyark -${health * 1}\n`
               str += `karena kamu telah berpetualang sampai ${pickRandom(['Jepang', 'Korea', 'Bali', 'Amerika', 'Iraq', 'Arab', 'Pakistan', 'German', 'Finlandia', 'Ke bawa dunia mimpi', 'Ujung dunia', 'Mars', 'Bulan', 'Pluto', 'Matahari', 'Hatinya dia', '...'])} dan mendapatkan\n\n`
               str += `[ 💵 ] = ${uang} Money\n`
               str += `[ ⚔️ ] = ${exp} Exp\n`
               str += `[ 🗑️ ] = ${sampah} Sampah\n`
               str += `[ 🌿 ] = ${potion == 0 ? '' : potion} Potion\n`
               str += `[ 💎 ] = ${diamond == 0 ? '' : diamond} Diamond\n`
               str += `[ 📦 ] = ${common == 0 ? '' : common} Common\n`
               str += `[ 📦 ] = ${uncommon == 0 ? '' : uncommon} Uncommon\n`
               setTimeout(() => {
                  conn.sendMessage(m.chat, {
                     text: str
                  }, {
                     quoted: m
                  })
               }, 0)
               setTimeout(() => {
                  conn.reply(m.chat, rendem, m)
               }, 1000)

               users.health -= health * 1
               users.exp += exp * 1
               users.tiketcoin += 1
               users.money += uang * 1
               users.potion += potion * 1
               users.diamond += diamond * 1
               users.common += common * 1
               users.uncommon += uncommon * 1
               users.sampah += sampah * 1
               users.mythic += mythic * 1
               users.legendary += legendary * 1
               users.lastadventure = new Date * 1
            } else conn.reply(m.chat, `Anda sudah berpetualang dan kelelahan, silahkan coba *${timers}* lagi`, m)
         } else conn.reply(m.chat, 'Minimal 80 health untuk bisa berpetualang, beli nyawa dulu dengan ketik *' + usedPrefix + 'shop buy potion <jumlah>*\ndan ketik *' + usedPrefix + 'use potion <jumlah>*', m)
      } catch (e) {
         console.log(e)
         conn.reply(m.chat, 'Error', m)
      }
   },
   limit: true,
   rpg: true,
   group: true
}