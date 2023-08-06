let handler = async (m, {
  usedPrefix,
  command,
  text
}) => {
  if (!m.quoted) return m.reply(`Reply sticker!`)
  try {
    let [packname, ...author] = text.split('|')
    author = (author || []).join('|')
    let mime = m.quoted.mimetype || ''
    if (!/webp/.test(mime)) return m.reply('Reply sticker!')
    let img = await m.quoted.download()
    await conn.sendSticker(m.chat, img, m, {
      packname: packname || '',
      author: author || ''
    })
  } catch (e) {
    console.log(e)
    return m.reply(Func.jsonFormat(e))
  }
}
handler.help = ['swm']
handler.tags = ['sticker']
handler.command = /^wm|swm|stickerwm$/i

module.exports = handler