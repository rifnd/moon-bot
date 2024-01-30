function handler(m, { text }) {
  let teks = text ? text : m.quoted && m.quoted.text ? m.quoted.text : m.text
  m.reply(teks.replace(/[aiueo]/gi, '$&ve'))
}
handler.help = ['namapurba']
handler.tags = ['fun']
handler.command = /^(namapurba)$/i
module.exports = handler