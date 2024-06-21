var handler = async (m, {
  conn,
  usedPrefix,
  command
}) => {
  try {
    let q = m.quoted ? m.quoted : m
    let mime = (q.msg || q).mimetype || ''
    if (!/image\/(jpe?g|png)/.test(mime)) return m.reply(`Kirim atau balas gambar yang ingin di restore dengan perintah ${usedPrefix + command}`)
    var res = await scrap.uploader(await m.quoted.download())
    m.react('🕒')
    var json = await Func.fetchJson(API('alya', '/api/restore', {
      image: res.data.url
    }, 'apikey'))
    if (!json.status) return m.reply(Func.jsonFormat(json))
    conn.sendFile(m.chat, json.data.url, '', '', m)
  } catch (e) {
    console.log(e)
    return m.reply(Func.jsonFormat(e))
  }
}
handler.help = handler.command = ['restore']
handler.tags = ['tools']
handler.limit = 10
module.exports = handler