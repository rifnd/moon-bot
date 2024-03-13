let handler = async (m) => {
  let q = m.quoted ? m.quoted : m
  let mime = (q.msg || q).mimetype || ''
  if (!mime) throw 'No media found'
  m.react('🕒')
  let media = await q.download()
  let isTele = /image\/(png|jpe?g|gif)|video\/mp4\/webp/.test(mime)
  let link = await (isTele ? scrap.telegraph : scrap.uploader)(media)
  m.reply(link.data.url)
}
handler.help = ['upload']
handler.tags = ['tools']
handler.command = ['upload', 'tourl']
handler.limit = true
module.exports = handler
