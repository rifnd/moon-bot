let handler = async (m, {
  conn,
  usedPrefix,
  command,
  text
}) => {
  try {
    let q = m.quoted ? m.quoted : m
    let mime = (q.msg || q).mimetype || ''
    if (!/image\/(jpe?g|png)/.test(mime)) return m.reply(`Send or reply to images with commands : *"${usedPrefix + command}"*`)
    let res = await scrap.uploader(await q.download())
    m.react('🕒')
    let json = await Func.fetchJson(API('alya', '/api/text-remover', {
      image: res.data.url
    }, 'apikey'))
    if (!json.status) return m.reply(Func.jsonFormat(json))
    conn.sendFile(m.chat, json.data.url, '', global.set.wm, m)
  } catch (e) {
    console.log(e)
    return m.reply(Func.jsonFormat(e))
  }
}
handler.help = ['textremover']
handler.tags = ['tools']
handler.command = /^(textremover)$/i
handler.limit = true
module.exports = handler