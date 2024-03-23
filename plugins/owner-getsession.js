let fs = require('fs')
let handler = async (m, { conn, text }) => {
  m.reply('Wait a moment, Getting the session.data.json file')
  let sesi = await fs.readFileSync('./session/creds.json')
  return await conn.sendMessage(m.chat, {
    document: sesi,
    mimetype: 'application/json',
    fileName: 'creds.json'
  }, { quoted: m })
}
handler.help = ['getsession']
handler.tags = ['owner']
handler.command = ['getsesi', 'getsession']
handler.owner = true
module.exports = handler
