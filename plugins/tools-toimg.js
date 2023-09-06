let { webp2png } = require('../lib/webp2mp4')
let handler = async (m, { 
  conn, 
  usedPrefix, 
  command
}) => {
  if (!m.quoted) return m.reply(`Reply stiker dengan perintah *${usedPrefix + command}*`)
  let mime = m.quoted.mimetype || ''
  if (!/webp/.test(mime)) return m.reply(`Reply stiker dengan perintah *${usedPrefix + command}*`)
  try {
    let media = await m.quoted.download()
    let out = Buffer.alloc(0)
    if (/webp/.test(mime)) {
      out = await webp2png(media)
    }
    conn.sendFile(m.chat, out, 'toimg.jpg', global.set.wm, m)
  } catch {
    throw `Reply stiker dengan perintah *${usedPrefix + command}*`
  }
}
handler.help = ['toimage']
handler.tags = ['tools']
handler.command = ['toimage', 'toimg']
module.exports = handler