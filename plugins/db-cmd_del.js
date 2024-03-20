let handler = async (m, {
  conn,
  usedPrefix,
  text,
  command
}) => {
  let hash = text
  if (m.quoted && m.quoted.fileSha256) hash = m.quoted.fileSha256.toString('hex')
  if (!hash) return m.reply(`Tidak ada hash`)
  let sticker = global.db.data.sticker
  if (sticker[hash] && sticker[hash].locked) return m.reply('Kamu tidak memiliki izin untuk menghapus perintah stiker ini')
  delete sticker[hash]
  m.reply(`Berhasil!`)
}
handler.help = ['cmd'].map(v => 'del' + v + '')
handler.tags = ['database']
handler.command = ['delcmd']
handler.premium = 1
module.exports = handler