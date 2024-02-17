let handler = async (m, {
  conn,
  usedPrefix,
  command
}) => {
  if (!m.quoted) throw `balas stiker dengan caption *${usedPrefix + command}*`
  let mime = m.quoted.mimetype || ''
  if (!/webp/.test(mime)) throw `balas stiker gif dengan caption *${usedPrefix + command}*`
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
handler.command = ['togif', 'tovideo']
module.exports = handler