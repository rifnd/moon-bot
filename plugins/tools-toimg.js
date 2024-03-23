let handler = async (m, {
  conn,
  usedPrefix,
  command
}) => {
  if (!m.quoted) return m.reply(`reply to stickers with commands *"${usedPrefix + command}"*`)
  let mime = m.quoted.mimetype || ''
  if (!/webp/.test(mime)) return m.reply(`Stickers only!`)
  let res = await scrap.uploader(await m.quoted.download())  
  let out = await Func.fetchJson(API('alya', '/api/webp-convert', {
    url: res.data.url,
    action: 'webp-to-png'
  }, 'apikey'))
  if (!out.status) return m.reply(Func.jsonFormat(out))
  conn.sendFile(m.chat, out.data.url, '', global.set.wm, m)
}
handler.help = ['toimg']
handler.tags = ['tools']
handler.command = ['toimg']
handler.limit = true
module.exports = handler