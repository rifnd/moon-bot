const uploadFile = require('../lib/uploadFile')
const uploadImage = require('../lib/uploadImage')

let handler = async (m) => {
  let q = m.quoted ? m.quoted : m
  let mime = (q.msg || q).mimetype || ''
  if (!mime) throw 'No media found'
  m.react('⌛')
  let media = await q.download()
  let isTele = /image\/(png|jpe?g|gif)|video\/mp4\/webp/.test(mime)
  let link = await (isTele ? uploadImage : uploadFile)(media)
  m.reply(`*${global.set.wm}*

${link}
${media.length} Byte(s)
${isTele ? '(No Expiry Date)' : '(Unknown)'}`)
}
handler.help = ['upload']
handler.tags = ['tools']
handler.command = /^upload|tourl$/i
handler.limit = true

module.exports = handler
