let handler = async (m, {
  usedPrefix,
  command,
  args
}) => {
  try {
    if (!m.quoted) return m.reply(`Reply sticker`)
    let q = m.quoted ? m.quoted : m
    let mime = (q.msg || q).mimetype || ''
    if (!/webp/.test(mime)) return m.reply(`Reply sticker`)
    let media = await q.download()
    let result = await scrap.uploader(media)
    if (!result) return m.reply(Func.jsonFormat(result))
    m.react('🕐')
    let json = await Func.fetchJson(API('alya', '/api/rotate', {
      image: result.data.url,
      action: command == 'flop' ? 'flop' : 'flip'
    }, 'apikey'))
    if (!json.status) return m.reply(Func.jsonFormat(json))
    await conn.sendSticker(m.chat, json.data.url, m, {
      packname: global.set.packname,
      author: global.set.author
    })
  } catch (e) {
    console.log(e)
    return m.reply(Func.jsonFormat(e))
  }
}
handler.help = handler.command = ['flip', 'flop']
handler.tags = ['sticker']
handler.limit = 1
module.exports = handler