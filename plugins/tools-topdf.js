let handler = async (m, {
  usedPrefix,
  command,
  args
}) => {
  try {
    let q = m.quoted ? m.quoted : m
    let mime = (q.msg || q).mimetype || ''
    if (!/image\/(jpe?g|png)/.test(mime)) return m.reply(`Send or reply to images with commands : *"${usedPrefix + command}"*`)
    let res = await scrap.uploader(await q.download())
    m.react('🕒')
    let json = await Func.fetchJson(API('alya', '/api/topdf', {
      image: res.data.url
    }, 'apikey'))
    if (!json.status) return m.reply(Func.jsonFormat(json))
    conn.sendFile(m.chat, json.data.url, '', '', m)
  } catch (e) {
    console.log(e)
    return m.reply(Func.jsonFormat(e))
  }
}
handler.halp = handler.command = ['topdf']
handler.tags = ['tools']
handler.limit = true
module.exports = handler