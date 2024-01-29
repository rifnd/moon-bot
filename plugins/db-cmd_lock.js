let handler = async (m, {
  conn,
  command
}) => {
  if (!m.quoted) return m.reply('Rely pesan')
  if (!m.quoted.fileSha256) return m.reply('SHA256 Hash Tidak Ditemukan')
  let sticker = global.db.data.sticker
  let hash = m.quoted.fileSha256.toString('hex')
  if (!(hash in sticker)) throw 'Hash tidak ditemukan dalam database'
  if (command === 'lockcmd') {
    sticker[hash].locked = true
    conn.reply(m.chat, 'Perintah stiker berhasil dikunci!', m)
  } else if (command === 'unlockcmd') {
    sticker[hash].locked = false
    conn.reply(m.chat, 'Perintah stiker berhasil dibuka ', m)
  } else {
    return m.reply(`Perintah tidak valid. Gunakan *${command}cmd* untuk mengunci atau membuka kunci perintah.`)
  }
}
handler.help = ['lockcmd', 'unlockcmd']
handler.tags = ['database']
handler.command = /^(un)?lockcmd$/i
handler.owner = true
module.exports = handler