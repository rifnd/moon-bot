let handler = async (m, {
  conn,
  usedPrefix,
  command,
  args
}) => {
  try {
    let q = m.quoted ? m.quoted : m
    let mime = (q.msg || q).mimetype || ''
    if (!/audio/.test(mime)) return m.reply(`Only for audio`)
    let media = await q.download()
    let res = await scrap.uploader(media)
    m.react('🕒')
    let json = await Func.fetchJson(API('alya', '/api/moise', {
      audio: res.data.url
    }, 'apikey'))
    if (!json.status) return m.reply(Func.jsonFormat(json))
    conn.sendMessage(m.chat, {
      audio: {
        url: json.data.url
      },
      mimetype: 'audio/mp3',
      fileName: Func.filename('mp3')
    }, { quoted: m })
  } catch (e) {
    console.log(e)
  }
}
handler.help = handler.command = ['removenoise']
handler.tags = ['tools']
handler.limit = true
module.exports = handler