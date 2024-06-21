let handler = async (m, {
  usedPrefix,
  command,
  args
}) => {
  try {
    let q = m.quoted ? m.quoted : m
    let mime = (q.msg || q).mimetype || ''
    if (!/image\/(jpe?g|png)/.test(mime)) {
      return m.reply(`Kirim atau balas gambar dengan perintah ${usedPrefix + command}`)
    }
    let res = await scrap.uploader(await q.download())
    m.react('🕒')
    var json = await Func.fetchJson(API('alya', '/api/face', {
      image: res.data.url
    }, 'apikey'))
    if (!json.status) return m.reply(Func.jsonFormat(json))
    m.reply(`Gender : ${json.data.gender}\nAge : ${json.data.age}`)
  } catch (e) {
    console.log(e)
    return m.reply(Func.jsonFormat(e))
  }
}
handler.help = handler.command = ['faceai']
handler.tags = ['tools']
handler.limit = true
module.exports = handler