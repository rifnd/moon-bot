const timeout = 28800000
let handler = async (m, {
   conn,
   usedPrefix,
   text,
   users,
   Func
}) => {
   let time = users.lastnambang + 28800000
   if (new Date - users.lastnambang < 28800000) return m.reply(`Kamu sudah nambang, kamu bisa nambang lagi dalam 8 jam kedapan\n\n*Timeout* : *[ ${Func.toTime(time - new Date())} ]*`)
   let berlians = `${Math.floor(Math.random() * 3)}`.trim()
   let emasbiasas = `${Math.floor(Math.random() * 4)}`.trim()
   let emasbatangs = `${Math.floor(Math.random() * 3)}`.trim()
   let caps = `*Selamat kamu mendapatkan*\n\n`
   caps += `[ 💍 ] +${Func.formatNumber(berlians)} berlian\n`
   caps += `[ 🪙 ] +${Func.formatNumber(emasbiasas)} emas\n`
   caps += `[ 💎 ] +${Func.formatNumber(emasbatangs)} diamond\n`
   users.berlian += berlians * 1
   users.emas += emasbiasas * 1
   users.diamond += emasbatangs * 1
   users.lastnambang = new Date * 1
   m.reply(caps)
}
handler.help = handler.command = ['nambang']
handler.tags = ['rpg']
handler.group = handler.limit = handler.rpg = handler.register = 1
module.exports = handler