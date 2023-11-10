let handler = async (m, {
  usedPrefix,
  command,
  args,
  text
}) => {
  try {
    let q = m.quoted ? m.quoted : m
    let mime = (q.msg || q).mimetype || ''
    if (!/image\/(jpe?g|png)/.test(mime)) return m.reply(`Kirim atau balas gambar dengan perintah ${usedPrefix + command}`)
    let media = await q.download()
    let url = await scrap.uploader(media)
    let old = new Date()
    m.react('🕒')
    const json = await Func.fetchJson(API('alya', '/api/colorizer', { image: url.data.url }, 'apikey'))
    if (!json.status) return m.reply(Func.jsonFormat(json))
    conn.sendFile(m.chat, json.data.url, '', `• *Fetching* : ${((new Date - old) * 1)} ms`, m)
  } catch (e) {
    console.log(e)
    return m.reply(Func.jsonFormat(e))
  }
}
handler.help = handler.command = ['recolor']
handler.tags = ['tools']
handler.limit = true
module.exports = handler