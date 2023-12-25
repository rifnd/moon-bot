let handler = async (m, {
  usedPrefix,
  command,
  args
}) => {
  try {
    let q = m.quoted ? m.quoted : m
    let mime = (q.msg || q).mimetype || ''
    if (!/image\/(jpe?g|png)/.test(mime)) return m.reply(`Send or reply to images containing text with commands ${usedPrefix + command}`)
    let media = await q.download()
    let url = await scrap.uploader(media)
    m.react('🕒')
    let json = await Func.fetchJson(API('alya', '/api/ocr', { image: url.data.url }, 'apikey'))
    if (!json.status) return m.reply(Func.jsonFormat(json))
    m.reply(json.data.text)
  } catch (e) {
    console.log(e)
    return m.reply(Func.jsonFormat(e))
  }
}
handler.help = handler.command = ['ocr']
handler.tags = ['tools']
handler.limit = 1
module.exports = handler