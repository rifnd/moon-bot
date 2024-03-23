let handler = async (m, {
  usedPrefix,
  command,
  args,
  text
}) => {
  let q = m.quoted ? m.quoted : m
  if (!q) return m.reply(`Send or reply to media with commands "${usedPrefix + command}"`)
  if ((q.msg || q).seconds > 11) return m.reply('Max 10 second')
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
    else return m.reply(`Send or reply to media with commands "${usedPrefix + command}"`)
  }
}
handler.help = ['sticker']
handler.tags = ['sticker']
handler.command = ['s', 'stiker', 'sticker']
module.exports = handler