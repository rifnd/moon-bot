let { MessageType } = require('@whiskeysockets/baileys')
let handler = async (m, { conn, text, usedPrefix }) => {
  function no(number) {
    return number.replace(/\s/g, '').replace(/([@+-])/g, '')
  }
  if (!text) return conn.reply(m.chat, Func.example(usedPrefix, 'delprem', '62xx'), m)
  text = no(text) + "@s.whatsapp.net"
  global.db.data.users[text].premium = false
  global.db.data.users[text].premiumDate = 0
  conn.reply(m.chat, `Berhasil menghapus akses premium @${text.split('@')[0]}.`, m, { contextInfo: { mentionedJid: [text] } })
}
handler.help = handler.command = ['delprem']
handler.tags = ['owner']
handler.owner = true
handler.fail = null
module.exports = handler