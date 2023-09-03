let handler = async (m, {
  usedPrefix,
  command,
  args
}) => {
  try {
    let q = m.quoted ? m.quoted : m
    let mime = (q.msg || q).mimetype || ''
    if (!/image\/(jpe?g|png)/.test(mime)) return m.reply(`Kirim atau balas gambar dengan perintah ${usedPrefix + command}`)
    let media = await q.download()
    let url = await scrap.uploader(media)
    m.reply(status.wait)
    let json = await Func.fetchJson(API('alya', '/api/toanime', { image: url.data.url, style: 'studio_original_painting_comic_triple' }, 'apikey'))
    if (!json.status) return m.reply(Func.jsonFormat(json))
    conn.sendFile(m.chat, json.data.img_urls[0], '', global.set.wm, m)
  } catch (e) {
    console.log(e)
    return m.reply(Func.jsonFormat(e))
  }
}
handler.help = handler.command = ['toanime']
handler.tags = ['tools']
handler.limit = 1
module.exports = handler