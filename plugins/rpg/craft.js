let handler = async (m, {
   conn,
   command,
   args,
   Func
}) => {
   let type = (args[0] || '').toLowerCase()
   let _type = (args[0] || '').toLowerCase()
   let user = db.data.users[m.sender]
   db.data.users[m.sender].pickaxe = db.data.users[m.sender].pickaxe || 0
   db.data.users[m.sender].pedang = db.data.users[m.sender].pedang || 0
   db.data.users[m.sender].fishingrod = db.data.users[m.sender].fishingrod || 0

   let caps = `
 █▀▀▀▀█▀▀▀▀█▀▀▀▀█
 █────█────█────█
 █▄▄▄▄█▄▄▄▄█▄▄▄▄█
 █▀▀▀▀█▀▀▀▀█▀▀▀▀█
 █────█────█────█
 █▄▄▄▄█▄▄▄▄█▄▄▄▄█
 █▀▀▀▀█▀▀▀▀█▀▀▀▀█
 █────█────█────█
 █▄▄▄▄█▄▄▄▄█▄▄▄▄█
 
 ⛊ Pickaxe ⛏️
 ⛊ Sword ⚔️
 ⛊ Fishingrod 🎣
 ⛊ Armor 🛡️
 ⛊ ATM 💳
 ⛊ Robo 🤖
 
 *「 RECIPE 」*
 
 ⬡ Pickaxe ⛏️
 │• 10 Kayu
 │• 5 Batu
 │• 5 Iron
 │• 20 String
 ╰────┈⭑
 ⬡ Sword ⚔️
 │• 10 Kayu
 │• 15 Iron
 ╰────┈⭑
 ⬡ Fishingrod 🎣
 │• 10 Kayu
 │• 2 Iron
 │• 20 String
 ╰────┈⭑
 ⬡ Armor 🥼
 │• 30 Iron
 │• 1 Emerald
 │• 5 Diamond
 ╰────┈⭑
 ⬡ Atm 💳
 │• 3 Emerald
 │• 6 Diamond
 │• 10k Money
 ╰────┈⭑
 ⬡ Robo 🤖
 │• 6 Emerald
 │• 12 Diamond
 │• 10k Money
 ╰────┈⭑
 `
   try {
      if (/craft|Crafting/i.test(command)) {
         const count = args[1] && args[1].length > 0 ? Math.min(99999999, Math.max(parseInt(args[1]), 1)) : !args[1] || args.length < 3 ? 1 : Math.min(1, count)
         switch (type) {
            case 'pickaxe':
               if (user.pickaxe > 0) return m.reply('Kamu sudah memilik ini')
               if (user.rock < 5 || user.wood < 10 || user.iron < 5 || user.string < 20) return m.reply(`Barang tidak cukup!\nUntuk membuat pickaxe. Kamu memerlukan : \n10 kayu🪵 \n5 iron⛓\n20 String🕸️\n5 Batu 🪨`)
               db.data.users[m.sender].wood -= 10
               db.data.users[m.sender].iron -= 5
               user.rock -= 5
               db.data.users[m.sender].string -= 20
               db.data.users[m.sender].pickaxe += 1
               user.pickaxedurability = 40
               m.reply("Sukses membuat 1 pickaxe 🔨")
               break
            case 'sword':
               if (user.sword > 0) return m.reply('Kamu sudah memilik ini')
               if (user.wood < 10 || user.iron < 15) return m.reply(`Barang tidak cukup!\nUntuk membuat sword. Kamu memerlukan :\n10 kayu🪵\n15 iron⛓️`)
               db.data.users[m.sender].wood -= 10
               db.data.users[m.sender].iron -= 15
               db.data.users[m.sender].sword += 1
               user.sworddurability = 40
               m.reply("Sukses membuat 1 sword 🗡️")
               break
            case 'fishingrod':
               if (user.fishingrod > 0) return m.reply('Kamu sudah memilik ini')
               if (user.wood < 20 || user.iron < 5 || user.string < 20) return m.reply(`Barang tidak cukup!\nUntuk membuat pancingan. Kamu memerlukan :\n10 kayu🪵\n5 iron⛓\n20 String🕸️`)
               db.data.users[m.sender].wood -= 10
               db.data.users[m.sender].iron -= 2
               db.data.users[m.sender].string -= 20
               db.data.users[m.sender].fishingrod += 1
               user.fishingroddurability = 40
               m.reply("Sukses membuat 1 Pancingan 🎣")
               break
            case 'armor':
               if (user.armor > 0) return m.reply('Kamu sudah memilik ini')
               if (user.iron < 30 || user.emerald < 1 || user.diamond < 5) return m.reply(`Barang tidak cukup!\nUntuk membuat armor. Kamu memerlukan :\n30 Iron ⛓️\n1 Emerald ❇️\n5 Diamond 💎`)
               db.data.users[m.sender].emerald -= 1
               db.data.users[m.sender].iron -= 30
               db.data.users[m.sender].diamond -= 5
               db.data.users[m.sender].armor += 1
               user.armordurability = 50
               m.reply("Sukses membuat 1 Armor 🛡️")
               break
            case 'atm':
               if (user.atm > 0) return m.reply('Kamu sudah memilik ini')
               if (user.emerald < 3 || user.money < 10000 || user.diamond < 6) return m.reply(`Barang tidak cukup!\nUntuk membuat atm. Kamu memerlukan :\n10k Money 💹\n3 Emerald ❇️\n6 Diamond 💎`)
               db.data.users[m.sender].emerald -= 3
               db.data.users[m.sender].money -= 10000
               db.data.users[m.sender].diamond -= 6
               db.data.users[m.sender].atm += 1
               db.data.users[m.sender].fullatm = 5000000
               m.reply("Sukses membuat 1 Atm 💳")
               break
            case 'robo':
               if (user.atm > 0) return m.reply('Kamu sudah memilik ini')
               if (user.emerald < 6 || user.money < 100000 || user.diamond < 12) return m.reply(`Barang tidak cukup!\nUntuk membuat atm. Kamu memerlukan :\n100k Money 💹\n6 Emerald ❇️\n12 Diamond 💎`)
               db.data.users[m.sender].emerald -= 6
               db.data.users[m.sender].money -= 100000
               db.data.users[m.sender].diamond -= 12
               db.data.users[m.sender].robo += 1
               db.data.users[m.sender].roboxp = 5
               m.reply("Sukses membuat 1 Robo 🤖")
               break

            default:
               return await conn.reply(m.chat, caps, m)
         }
      } else if (/enchant|enchan/i.test(command)) {
         const count = args[2] && args[2].length > 0 ? Math.min(99999999, Math.max(parseInt(args[2]), 1)) : !args[2] || args.length < 4 ? 1 : Math.min(1, count)
         switch (_type) {
            case 't':
               break
            case '':
               break

            default:
               return conn.reply(m.chat, caption, m)
         }
      }
   } catch (er) {
      m.reply(Func.jsonFormat(e))
   }
}
handler.help = ['craft']
handler.tags = ['rpg']
handler.command = /^(craft|crafting|chant)/i
handler.limit = handler.group = handler.rpg = handler.register = 1
module.exports = handler