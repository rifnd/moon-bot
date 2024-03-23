let handler = async (m, {
  usedPrefix,
  command,
  args
}) => {
  try {
    let q = m.quoted ? m.quoted : m
    let mime = (q.msg || q).mimetype || ''
    if (!mime) return m.reply(`send or reply to the song you want to detect with the command ${usedPrefix + command}`)
    let media = await q.download()
    let isMedia = /video\/mp4\/audio\/vn/.test(mime)
    let link = await (isMedia ? Func.uploader : Func.uploader)(media)
    m.react('🕛')
    const json = await Func.fetchJson(API('alya', '/api/detect-song', { url: link.data.url }, 'apikey'))
    if (!json.status) return m.reply(Func.jsonFormat(json))
    for (let i of json.data) {
      let tek = `乂  *D E T E C T - S O N G*\n\n`
      tek += `  ∘  *Title* : ${i.title}\n`
      tek += `  ∘  *Artis* : ${i.artists[0].name}\n`
      tek += `  ∘  *Album* : ${i.album.name}\n`
      tek += `  ∘  *Relase Date* : ${i.release_date}\n\n`
      tek += global.set.footer
      m.reply(tek)
    }
  } catch (e) {
    console.log(e)
    m.reply(Func.jsonFormat(e))
  }
}
handler.help = handler.command = ['detectsong']
handler.tags = ['tools']
handler.limit = 1
module.exports = handler