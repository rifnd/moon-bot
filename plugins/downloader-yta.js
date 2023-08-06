let handler = async (m, {
  usedPrefix,
  command,
  args
}) => {
  if (!args[0]) return m.reply(Func.example(usedPrefix, command, 'https://youtube.com/watch?v=-BaHui7--ak'))
  if (!/^(?:https?:\/\/)?(?:www\.|m\.|music\.)?youtu\.?be(?:\.com)?\/?.*(?:watch|embed)?(?:.*v=|v\/|\/)([\w\-_]+)\&?/.test(args[0])) return m.reply(status.invalid)
  m.reply(status.wait)
  try {
    const json = await Func.fetchJson(API('alya', '/api/yta', { url: args[0] }, 'apikey'))
    if (!json.status) return m.reply(Func.jsonFormat(json))
    let ca = `❏  *Y T - M P 3*\n\n`
    ca += ` ›  *Judul* : ` + json.title + `\n`
    ca += ` ›  *Durasi* : ` + json.duration + `\n`
    ca += ` ›  *Penonton* : ` + json.views + `\n`
    ca += ` ›  *Ukuran* : ` + json.data.size + `\n\n`
    ca += global.set.footer
    let xSize = Func.sizeLimit(json.data.size, global.set.max_upload)
    if (xSize.oversize) return m.reply(`Ukuran file (${json.data.size}) terlalu besar, silahkan download sendiri lewat link ini : ${await (await Func.shortlink(json.data.url))}`)
    conn.sendMessageModify(m.chat, ca, m, {
      largeThumb: true,
      thumbnail: json.thumbnail
    }).then(async () => {
      conn.sendMessage(m.chat, json.data.link, m, {
        filename: json.title + '.mp3',
        mentions: [m.sender]
      })
    })
  } catch (e) {
    console.log(e)
    return m.reply(status.error)
  }
}
handler.help = ['ytmp3'].map(v => v + ' <url>')
handler.tags = ['downloader']
handler.command = /^(yt(mp3|a))$/i 
handler.limit = 1 

module.exports = handler
