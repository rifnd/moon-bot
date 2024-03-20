let handler = async (m, { command, usedPrefix, text }) => {
  let which = command.replace(/del/i, '')
  if (!text) return m.reply(`Gunakan *${usedPrefix}list${which}* untuk melihat daftar nya`)
  let msgs = global.db.data.msgs
  if (!text in msgs) return m.reply(`'${text}' tidak terdaftar di daftar pesan`)
  delete msgs[text]
  m.reply(`Berhasil menghapus pesan di daftar pesan dengan nama '${text}'`)
}
handler.help = ['vn', 'msg', 'video', 'audio', 'img', 'sticker', 'gif'].map(v => 'del' + v + ' ')
handler.tags = ['database']
handler.command = /^del(vn|msg|video|audio|img|stic?ker|gif)$/
module.exports = handler