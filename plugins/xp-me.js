let levelling = require('../lib/levelling')
let handler = async (m, {
  usedPrefix,
  command,
  text,
  args
}) => {
  try {
    var pp = await conn.profilePictureUrl(m.sender, 'image')
  } catch (e) {
    var pp = 'https://telegra.ph/file/32ffb10285e5482b19d89.jpg'
  } finally {
    //if (typeof db.data.users[m.sender] == 'undefined') return m.reply(Func.texted('bold', '🚩 Can\'t find user data.'))
    let setting = db.data.users[m.sender]
    let { min, xp, max } = levelling.xpRange(setting.level, global.multiplier)
    let pme = `乂  *U S E R - I N F O*\n\n`
    pme += `  ∘  *Name* : ${conn.getName(m.sender)} ${setting.registered ? '(' + setting.name + ') ' : ''}\n`
    pme += `  ∘  *Partner* : ${setting.pasangan ? ` @${setting.pasangan.split`@`[0]}` : '×'}\n`
    pme += `  ∘  *Exp* : ${Func.formatNumber(setting.exp)} (${setting.exp - min} / ${xp})\n`
    pme += `  ∘  *Level* : ${setting.level}\n`
    pme += `  ∘  *Role* : ${setting.role}\n`
    pme += `  ∘  *Limit* : ${Func.formatNumber(setting.limit)}\n`
    pme += `  ∘  *Money* : ${Func.formatNumber(setting.money)}\n\n`
    pme += `乂  *U S E R - S T A T U S*\n\n`
    pme += `  ∘  *Register* : ${setting.registered ? "√" : "×"}\n`
    pme += `  ∘  *Premium* : ${setting.premium ? "√" : "×"}\n`
    pme += `  ∘  *Expired* : ${setting.premiumTime - new Date() * 1 > 1 ? Func.toDate(setting.premiumTime - new Date() * 1) : "-"}\n`
    pme += `  ∘  *Banned* : ${setting.banned ? "√" : "×"}\n\n`
    pme += global.set.footer
    conn.sendMessageModify(m.chat, pme, m, {
      largeThumb: true,
      thumbnail: pp
    })
  }
}
handler.help = handler.command = ['me']
handler.tag = ['xp']
module.exports = handler