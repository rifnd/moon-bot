let handler = async (m, {
   conn,
   usedPrefix,
   command,
   text,
   Func
}) => {
   let salah = `Pilihan Yang Tersedia\n\nGunting, Kertas, Batu\n\n${usedPrefix}suit gunting\n\nKasih Spasi!`
   if (!text) return m.reply(salah)
   var astro = Math.random()
   if (astro < 0.34) {
      astro = 'batu'
   } else if (astro > 0.34 && astro < 0.67) {
      astro = 'gunting'
   } else {
      astro = 'kertas'
   }
   if (text == astro) {
      m.reply(`Seri!\nkamu : ${text}\nBot : ${astro}`)
   } else if (text == 'batu') {
      if (astro == 'gunting') {
         global.db.users[m.sender].money += 1000
         m.reply(`Kamu Menang!\n +1000 Money\nKamu : ${text}\nBot : ${astro}`)
      } else {
         m.reply(`Kamu Kalah!\nKamu : ${text}\nBot : ${astro}`)
      }
   } else if (text == 'gunting') {
      if (astro == 'kertas') {
         global.db.users[m.sender].money += 1000
         m.reply(`Kamu Menang!\n+1000 Money\nKamu : ${text}\nBot : ${astro}`)
      } else {
         m.reply(`Kamu Kalah!\nKamu : ${text}\nBot : ${astro}`)
      }
   } else if (text == 'kertas') {
      if (astro == 'batu') {
         global.db.users[m.sender].money += 1000
         m.reply(`Kamu Menang! \n+1000 Money\nKamu : ${text}\nBot: ${astro}`)
      } else {
         m.reply(`Kamu Kalah!\nKamu : ${text}\nBot : ${astro}`)
      }
   } else {
      return m.reply(salah)
   }
}
handler.help = ['suit']
handler.tags = ['game']
handler.limit = handler.game = handler.group = handler.register = true
module.exports = handler