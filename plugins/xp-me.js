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
    var pp = './src/pp.png'
  } finally {
    let setting = db.data.users[m.sender]
    let { min, xp, max } = levelling.xpRange(setting.level, global.multiplier)
    let pme = `–  *U S E R - I N F O*\n\n`
    pme += `  ∘  *Name* : ${conn.getName(m.sender)} ${setting.registered ? '(' + setting.name + ') ' : ''}\n`
    pme += `  ∘  *Partner* : ${setting.partner ? ` @${setting.partner.split`@`[0]}` : '×'}\n`
    pme += `  ∘  *Exp* : ${Func.formatNumber(setting.exp)} (${setting.exp - min} / ${xp})\n`
    pme += `  ∘  *Level* : ${setting.level}\n`
    pme += `  ∘  *Role* : ${setting.role}\n`
    pme += `  ∘  *Limit* : ${Func.formatNumber(setting.limit)}\n`
    pme += `  ∘  *Money* : ${Func.formatNumber(setting.money)}\n\n`
    pme += `–  *U S E R - S T A T U S*\n\n`
    pme += `  ∘  *Register* : ${setting.registered ? "√" : "×"}\n`
    pme += `  ∘  *Premium* : ${setting.premium ? "√" : "×"}\n`
    pme += `  ∘  *Expired* : ${setting.premiumTime - new Date() * 1 > 1 ? Func.toDate(setting.premiumTime - new Date() * 1) : "-"}\n`
    pme += `  ∘  *Banned* : ${setting.banned ? "√" : "×"}\n\n`
    pme += global.set.footer
    /*conn.reply(m.chat, pme, m, {
      contextInfo: {
        mentions: await conn.parseMention(pme),
        externalAdReply: {
          title: global.set.wm,
          mediaType: 1,
          thumbnail: await Func.fetchBuffer(pp),
          thumbnailUrl: pp,
          renderLargerThumbnail: true
        }
      }
    })*/
    conn.sendMessageModify(m.chat, pme, m, {
      largeThumb: true,
      thumbnail: await Func.fetchBuffer(pp)
    })
  }
}
handler.help = handler.command = ['me']
handler.tag = ['xp']
module.exports = handler