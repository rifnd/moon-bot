let handler = async (m, {
  usedPrefix,
  command,
  text
}) => {
  try {
    if (!text) return m.reply(Func.example(usedPrefix, command, 'dance'))
    let syle = ['dance', 'anime', 'realistic', 'spectrum', 'pastel_3d', 'shimmering', 'cute_3d', 'cartoon', 'rubber', 'romantic', 'memphis', 'watercolor', 'pscyhedelic', 'neondark', 'retro_radiance', 'Innocent_cute', 'soft_radiance', 'golden_hour', 'commercial_portrait', 'dreamlike_portraiture', 'dreamy_3d', 'impasto_comic', 'illustrative', 'pleasantly', '8bit_arcade', 'everiything_kawai', 'back_to_1950', 'horror', 'anclent_china', 'future', 'storybook', 'arcane_elegance', 'vibrant']
    if (!syle.includes(text)) return m.reply(syle.map((i, u) => `${u + 1}. *${i}*`).join('\n'))
    let q = m.quoted ? m.quoted : m
    let mime = (q.msg || q).mimetype || ''
    if (!/image\/(jpe?g|png)/.test(mime)) return m.reply(`Send or reply to images with commands ${usedPrefix + command}`)
    let media = await scrap.uploader(await q.download())
    m.reply(status.wait)
    let json = await Func.fetchJson(API('alya', '/api/avaturnme', { image: media.data.url, style: text }, 'apikey'))
    if (!json.status) return m.reply(Func.jsonFormat(json))
    json.data.img_output.map(id => {
      conn.sendFile(m.chat, id, 'image.png', '', m)
    })
  } catch (e) {
    console.log(e)
    return m.reply(Func.jsonFormat(e))
  }
}
handler.help = handler.command = ['avatar']
handler.tags = ['effect']
handler.limit = 1
module.exports = handler