let handler = async (m, { conn, isBotAdmin }) => {
  try {
    if (m.isGroup) {
      if (!m.quoted) throw m.reply('Balas pesan yang ingin kamu hapus.')
      conn.sendMessage(m.chat, {
        delete: {
          remoteJid: m.chat,
          fromMe: isBotAdmin ? false : true,
          id: m.quoted.id,
          participant: m.quoted.sender,
        },
      })
    } else if (!m.isGroup) {
      if (!m.quoted) throw false
      let { chat, fromMe, id, isBaileys } = m.quoted
      if (!isBaileys) return m.reply('Pesan tidak dikirim oleh bot!.')
      conn.sendMessage(m.chat, {
        delete: {
          remoteJid: m.chat,
          fromMe: true,
          id: m.quoted.id,
          participant: m.quoted.sender,
        },
      })
    }
  } catch (e) {
    throw m.reply(status.error)
  }
}
handler.help = ['delete']
handler.tags = ['group']
handler.command = ['delete', 'del']
handler.limit = true
module.exports = handler
