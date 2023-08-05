let handler = async (m, {
  usedPrefix,
  command,
  args,
  text
}) => {
  let q = m.quoted ? m.quoted : m 
  if (!q) return m.reply(`Kirim atau balas media dengan perintah ${usedPrefix + command}\n\nMaksimal durasi video 10 detik.`)
  let mime = (q.msg || q).mimetype || ''
  try {
    if (/webp/.test(mime)) {
      var med = await q.download()
    } else if (/image/.test(mime)) {
      var med = await q.download()
    } else if (/video/.test(mime)) {
      var med = await q.download()
    } else if (isUrl) {
      var med = `${args[0]}`
    }
  } finally {
    if (med) conn.sendSticker(m.chat, med, m, {
      packname: global.set.packname,
      author: global.set.author
    })
    else return m.reply(`Kirim atau balas media dengan perintah ${usedPrefix + command}\n\nMaksimal durasi video 10 detik.`)
  }
}
handler.help = ['sticker']
handler.tags = ['sticker']
handler.command = /^(s|sticker|stiker)$/i 

module.exports = handler