let handler = async (m, {
   args,
   usedPrefix,
   Func
}) => {
   let user = db.data.users[m.sender]
   if (user.health >= 100) return m.reply(Func.texted('bold', 'Nyawa kamu udah penuh'))
   const heal = 50
   let count = Math.max(1, Math.min(Number.MAX_SAFE_INTEGER, (isNumber(args[0]) && parseInt(args[0]) || Math.round((100 - user.health) / heal)))) * 1
   if (user.potion < count) return m.reply(Func.texted('bold', `Kamu hanya mempunyai ${user.potion} potion, kirim ${usedPrefix}buy potion ${count - user.potion} untuk membeli potion`))
   user.potion -= count * 1
   user.health += heal * count
   m.reply(Func.texted('bold', `Berhasil menggunakan ${count} Potion`))
}
handler.help = ['heal']
handler.tags = ['rpg']
handler.command = /^(heal)$/i
handler.limit = handler.group = handler.rpg = handler.register = 1
module.exports = handler

function isNumber(number) {
   if (!number) return number
   number = parseInt(number)
   return typeof number == 'number' && !isNaN(number)
}