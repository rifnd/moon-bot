let handler = async (m, {
  usedPrefix,
  command,
  text
}) => {
  try {
    if (!text) return conn.reply(m.chat, Func.example(usedPrefix, command, 'https://pin.it/5fXaAWE'), m)
    if (!text.match(/pin(?:terest)?(?:\.it|\.com)/)) return conn.reply(m.chat, global.status.invalid, m)
    m.reply(status.wait)
    let old = new Date()
    let json = await Func.fetchJson(API('alya', '/api/pins', { url: text }, 'apikey'))
    if (!json.status) return conn.reply(m.chat, Func.jsonFormat(json), m)
    json.data.map(v => {
      if (v.type == 'video') return conn.sendFile(m.chat, v.url, 'video.mp4', '', m)
      if (v.type == 'image') return conn.sendFile(m.chat, v.url, 'image.jpg', '', m)
    })
  } catch (e) {
    console.log(e)
    return m.reply(status.error)
  }
}
handler.help = ['pindl']
handler.tags = ['downloader']
handler.command = /^(pindl)$/i
handler.limit = 1

module.exports = handler