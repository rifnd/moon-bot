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
    action: 'webp-to-mp4'
  }, 'apikey'))
  if (!out.status) return m.reply(Func.jsonFormat(out))
  conn.sendFile(m.chat, out.data.url, '', global.set.wm, m, false, {
    mimetype: 'video/gif',
    thumbnail: Buffer.alloc(0)
  })
}
handler.help = ['tomp4']
handler.tags = ['tools']
handler.command = ['togif', 'tovideo', 'tomp4']
module.exports = handler