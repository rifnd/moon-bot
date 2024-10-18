let handler = async (m, {
   conn,
   usedPrefix,
   text,
   users,
   Func
}) => {
   let time = users.lastmining + 28800000
   if (new Date - users.lastmining < 28800000) return m.reply(`Kamu sudah melakukan mining\n\n*Timeout* : [ ${Func.toTime(time - new Date())} ]`)
   let limitt = Func.randomInt(10, 50)
   let xpee = Func.randomInt(100, 10000)
   let moneyy = Func.randomInt(100, 10000)
   users.limit += limitt
   users.exp += xpee
   users.money += moneyy
   users.lastmining = new Date * 1
   let tek = `*Selamat kamu mendapatkan*\n\n`
   tek += `[ 😑 ] +${Func.formatNumber(xpee)} exp\n`
   tek += `[ 💴 ] +${Func.formatNumber(moneyy)} money\n`
   tek += `[ 🍟 ] +${Func.formatNumber(limitt)} limit`
   m.reply(tek)
}
handler.help = ['mining']
handler.tags = ['rpg']
handler.command = /^(hadiah|mining)/i
handler.group = handler.rpg = handler.register = handler.limit = true
module.exports = handler