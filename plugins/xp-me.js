let PhoneNumber = require('awesome-phonenumber')
let levelling = require('../lib/levelling')
const axios = require('axios')
const fetch = require('node-fetch')
const moment = require('moment-timezone')
let handler = async (m, {
  usedPrefix,
  command,
  text,
  args
}) => {
  try {
    var who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender
    var pp = await conn.profilePictureUrl(who, 'image')
  } catch (e) {
    var pp = 'https://telegra.ph/file/32ffb10285e5482b19d89.jpg'
  } finally {
    if (typeof db.data.users[who] == 'undefined') return m.reply(`Tidak terdaftar di database.`)
    let groupMetadata = m.isGroup ? await conn.groupMetadata(m.chat) : {}
    let participants = m.isGroup ? groupMetadata.participants : []
    let users = m.isGroup ? participants.find((u) => u.jid == who) : {}
    let number = who.split('@')[0]
    let about = ((await conn.fetchStatus(who).catch(console.error)) || {}).status || ''
    let setting = db.data.users[who]
    let now = new Date() * 1
    let { min, xp, max } = levelling.xpRange(setting.level, global.multiplier)
    let username = conn.getName(who)
    let math = max - xp
    let prem = global.prems.includes(who.split`@`[0])
    let jodoh = `@${setting.pasangan.split`@`[0]}`
    let pme = `乂  *U S E R - I N F O*\n\n`
    pme += `  ∘  *Name* : ${username} ${setting.registered ? '(' + setting.name + ') ' : ''}\n`
    pme += `  ∘  *Partner* : ${setting.pasangan ? jodoh : '×'}\n`
    pme += `  ∘  *Exp* : ${Func.formatNumber(setting.exp)} (${setting.exp - min} / ${xp})\n`
    pme += `  ∘  *Level* : ${setting.level}\n`
    pme += `  ∘  *Role* : ${setting.role}\n`
    pme += `  ∘  *Limit* : ${Func.formatNumber(setting.limit)}\n`
    pme += `  ∘  *Money* : ${Func.formatNumber(setting.money)}\n\n`
    pme += `乂  *U S E R - S T A T U S*\n\n`
    pme += `  ∘  *Register* : ${setting.registered ? "√" : "×"}\n`
    pme += `  ∘  *Premium* : ${setting.premium ? "√" : "×"}\n`
    pme += `  ∘  *Expired* : ${setting.premiumTime - now > 1 ? Func.toDate(setting.premiumTime - now) : "-"}\n`
    pme += `  ∘  *Banned* : ${setting.banned ? "√" : "×"}\n\n`
    pme += global.set.footer
    let mentionedJid = [who]
    conn.sendMessageModify(m.chat, pme, m, {
      largeThumb: true,
    })
  }
}
handler.help = handler.command = ['me']
handler.tag = ['xp']
module.exports = handler