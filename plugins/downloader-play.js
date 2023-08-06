const yts = require('yt-search')
let handler = async (m, {
  usedPrefix,
  command,
  text
}) => {
  if (!text) return m.reply(Func.example(usedPrefix, command, 'Utopia'))
  try {
    let yt = await (await yts(text)).all
    let json = await Func.fetchJson(API('alya', '/api/yta', { url: yt[0].url }, 'apikey'))
    if (!json.status) return m.reply(Func.jsonFormat)
    let teks = `${json.title}\n`
    teks += `${yt[0].description}`
    let xSize = Func.sizeLimit(json.data.size, global.set.max_upload)
    if (xSize.oversize) return m.reply(`Ukuran file (${json.data.size}) terlalu besar, silahkan download sendiri lewat link ini : ${await (await Func.shortlink(json.data.url))}`)
    conn.sendMessageModify(m.chat, teks, m, {
      largeThumb: true,
      thumbnail: json.thumbnail
    }).then(async () => {
      conn.sendMedia(m.chat, json.data.url, m, {
        filename: json.title + '.mp3',
        mentions: [m.sender]
      })
    })
  } catch (e) {
    console.log(e)
    return m.reply(status.error)
  }
}
handler.help = ['play'].map((v) => v + '')
handler.tags = ['downloader']
handler.command = /^(play)$/i
handler.limit = 1
module.exports = handler
