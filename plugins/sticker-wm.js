const {
  addExif
} = require('../lib/sticker')
let handler = async (m, {
  conn,
  text
}) => {
  if (!m.quoted) return m.reply(`Balas stikernya!!`)
  let stiker = false
  try {
    let [packname, ...author] = text.split('|')
    author = (author || []).join('|')
    let mime = m.quoted.mimetype || ''
    if (!/webp/.test(mime)) return m.reply(`Balas stikernya!!`)
    let img = await m.quoted.download()
    if (!img) return m.reply(`Balas stikernya!!`)
    stiker = await addExif(img, packname || '', author || '')
  } catch (e) {
    console.error(e)
    if (Buffer.isBuffer(e)) stiker = e
  } finally {
    if (stiker) conn.sendFile(m.chat, stiker, 'wm.webp', '', m, false, {
      asSticker: true
    })
    else return m.reply(status.error)
  }
}
handler.help = ['swm']
handler.tags = ['sticker']
handler.command = /^wm|swm$/i

module.exports = handler
