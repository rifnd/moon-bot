let handler = async (m, {
  conn,
  usedPrefix,
  command,
  text
}) => {
  let style = ['Anime', 'Last_of_Us', 'Cyberphunk', 'Disney', 'Barbie', 'Baby_Filter', 'Joker', 'Oil_Painting', 'Old_Filter', 'Pixel_Art', 'Potrait_Style', 'Spider_Verse', 'Toonify', 'GTA', 'Verctor_Art', 'Vibrant_Pastel_Colors', 'Watercolor', 'Watercolor_Drawing', 'Zombie']
  let stel = text.trim()//.toLowerCase()
  let print = `Use this feature based on the style below :\n\n`
  print += style.sort((a, b) => a.localeCompare(b)).map((v, i) => {
    if (i == 0) {
      return `┌  ◦  ${usedPrefix + command} ${v}`
    } else if (i == style.sort((a, b) => a.localeCompare(b)).length - 1) {
      return `└  ◦  ${usedPrefix + command} ${v}`
    } else {
      return `│  ◦  ${usedPrefix + command} ${v}`
    }
  }).join('\n')
  print += `\n\n${global.set.footer}`
  if (!style.includes(stel)) return conn.reply(m.chat, print, m)
  let q = m.quoted ? m.quoted : m
  let mime = (q.msg || q).mimetype || q.mediaType || ''
  if (!mime) return m.reply(Func.texted('bold', '🚩 Reply photo.'))
  if (!/image\/(jpe?g|png)/.test(mime)) return m.reply(Func.texted('bold', '🚩 Only for photo.'))
  m.react('🕒')
  let old = new Date()
  const buffer = await q.download()
  const json = await scrap.uploader(buffer)
  try {
    const url = await Func.fetchJson(API('alya', '/api/illustration', {
      image: json.data.url,
      style: stel
    }, 'apikey'))
    if (!url.status) return m.reply(Func.jsonFormat(url))
    conn.sendFile(m.chat, url.data.url, Func.filename('jpg'), `• *Fetching* : ${(new Date() - old) * 1} ms`, m)
  } catch (e) {
    console.log(e)
    return m.reply(Func.jsonFormat(e))
  }
}
handler.help = ['illustration'].map(v => v + ' ')
handler.tags = ['effect']
handler.command = /^(illust(ration)?)$/i
handler.limit = true
module.exports = handler