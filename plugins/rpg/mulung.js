let handler = async (m, {
   conn,
   usedPrefix,
   command,
   text,
   users,
   Func
}) => {
   let timeClaim = 86400000
   let claimed = new Date(users.lastmulung + timeClaim)
   let timeout = claimed - new Date()
   let botol = Func.randomInt(50, 500)
   let kaleng = Func.randomInt(50, 500)
   let kardus = Func.randomInt(50, 500)
   if (new Date - users.lastmulung > timeClaim) {
      let cap = `*Selamat kamu mendapatkan*\n\n`
      cap += `[ 🍾 ] = +${Func.formatNumber(botol)} botol\n`
      cap += `[ 🥫 ] = +${Func.formatNumber(kaleng)} kaleng\n`
      cap += `[ 📦 ] = +${Func.formatNumber(kardus)} kardus`
      conn.reply(m.chat, cap, m)
      users.botol += botol
      users.kaleng += kaleng
      users.kardus += kardus
      users.lastmulung = new Date() * 1
   } else {
      conn.reply(m.chat, `*Kamu sudah mulung dan kelelahan, istirahat dulu*\n\n*Timeout : [ ${Func.toTime(timeout)} ]*`, m)
   }
}
handler.help = ['mulung']
handler.tags = ['rpg']
handler.command = /^(mulung)$/i
handler.group = handler.rpg = handler.limit = true
module.exports = handler