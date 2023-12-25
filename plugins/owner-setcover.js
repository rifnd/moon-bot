let handler = async (m, {
  usedPrefix,
  command,
  args,
  setting
}) => {
  try {
    let q = m.quoted ? m.quoted : m
    let mime = (q.msg || q).mimetype || ''
    if (!/image\/(jpe?g|png)/.test(mime)) return m.reply(`Send or reply to images with commands ${usedPrefix + command}`)
    let img = await q.download()
    if (!img) return m.reply(status.wrong)
    let json = await scrap.uploaderV2(img)
    if (!json.status) return m.reply(Func.jsonFormat(json))
    setting.cover = json.data.url
    m.reply('Cover successfully changed')
  } catch (e) {
    console.log(e)
    return m.reply(Func.jsonFormat(e))
  }
}
handler.help = handler.command = ['setcover']
handler.tags = ['owner']
handler.owner = 1
module.exports = handler