let handler = async (m, {
  usedPrefix,
  command,
  text
}) => {
  try {
    if (!text) return m.reply(Func.example(usedPrefix, command, 'moon-bot'))
    m.react('🕒')
    let q = m.quoted ? m.quoted : m
    let mime = (q.msg || q).mimetype || ''
    if (/image\/(jpe?g|png)/.test(mime)) {
      try {
        let res = await scrap.uploader(await q.download())
        let respon = await Func.fetchJson(API('alya', '/api/func-chat', {
          model: 'bing',
          system: text,
          image: res.data.url
        }, 'apikey'))
        if (!respon.status) return m.reply(Func.jsonFormat(respon))
        m.reply(respon.data.content)
      } catch (i) {
        return conn.reply(m.chat, Func.jsonFormat(i), m)
      }
    } else if (text) {
      const json = await Func.fetchJson(API('alya', '/api/bing', {
        q: text
      }, 'apikey'))
      if (!json.status) return m.reply(Func.jsonFormat(json))
      m.reply(json.data.content)
    }
  } catch (e) {
    console.log(e)
    return m.reply(Func.jsonFormat(e))
  }
}
handler.help = handler.command = ['bing']
handler.tags = ['internet']
handler.limit = true
module.exports = handler