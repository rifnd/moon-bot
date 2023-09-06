const didyoumean = require('didyoumean')
const similarity = require('similarity')
let handler = (m) => m 
handler.before = async function(m, {
  match,
  usedPrefix
}) {
  if ((usedPrefix = (match[0] || '')[0])) {
    let noPrefix = m.text.replace(usedPrefix, '')
    let args = noPrefix.trim().split` `.slice(1)
    let help = Object.values(plugins).filter(v => v.help && !v.disabled).map(v => v.help).flat(1)
    if (help.includes(noPrefix)) return
    let mean = didyoumean(noPrefix, help)
    if (!mean) return
    let sim = similarity(noPrefix, mean) 
    if (sim === 1 || mean.toLowerCase() === noPrefix.toLowerCase()) return
    let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? this.user.jid : m.sender
    let name = await this.getName(who)
    this.reply(m.chat, `⚠️ Perintah yang kamu gunakan salah, coba rekomendasi berikut ini :\n\n→ ${usedPrefix + mean} (${Number(sim * 100).toFixed(2)}%)`, m)
  }
  return true
}
module.exports = handler