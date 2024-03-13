const similarity = require('similarity')
const threshold = 0.72
let handler = m => m
handler.before = async function (m) {
  let id = m.chat
  if (!m.quoted || !m.quoted.fromMe || !m.quoted.isBaileys || !/.nime/i.test(m.quoted.text)) return !0
  this.tebakanime = this.tebakanime ? this.tebakanime : {}
  if (!(id in this.tebakanime)) return m.reply('The matter has ended.')
  if (m.quoted.id == this.tebakanime[id][0].id) {
    let json = JSON.parse(JSON.stringify(this.tebakanime[id][1]))
    // m.reply(JSON.stringify(json, null, '\t'))
    if (m.text.toLowerCase() == json.data.title.toLowerCase().trim()) {
      global.db.data.users[m.sender].exp += this.tebakanime[id][2]
      global.db.data.users[m.sender].tiketcoin += 1
      m.reply(`*Correct!*\n+${this.tebakanime[id][2]} XP\n+1 Tiketcoin`)
      clearTimeout(this.tebakanime[id][3])
      delete this.tebakanime[id]
    } else if (similarity(m.text.toLowerCase(), json.data.title.toLowerCase().trim()) >= threshold) m.reply(`*Approaching!*`)
    else m.reply(`*Wrong!*`)
  }
  return !0
}
handler.exp = 0
module.exports = handler