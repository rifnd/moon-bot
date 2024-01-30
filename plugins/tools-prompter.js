let handler = async (m, {
  usedPrefix,
  command,
  args
}) => {
  try {
    let q = m.quoted ? m.quoted : m
    let mime = (q.msg || q).mimetype || ''
    if (!/image\/(jpe?g|png)/.test(mime)) return m.reply(Func.texted('bold', '🚩 Tidak ada media yang ditemukan'))
    let media = await q.download()
    let url = await scrap.uploader(media)
    let old = new Date()
    m.react('🕒')
    let json = await Func.fetchJson(API('alya', '/api/prompter', { image: url.data.url }, 'apikey'))
    if (!json.status) return m.reply(Func.jsonFormat(json))
    m.reply(json.data.output)
  } catch (e) {
    console.log(e)
    return m.reply(Func.jsonFormat(e))
  }
}
handler.help = ['prompter']
handler.tags = ['tools']
handler.command = ['prompter', 'prompt']
handler.premium = true
module.exports = handler