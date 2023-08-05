let handler = async (m, {
  usedPrefix,
  command,
  args
}) => {
  if (!args[0]) return m.reply(Func.example(usedPrefix, command, 'https://youtube.com/watch?v=-BaHui7--ak'))
  if (!/^(?:https?:\/\/)?(?:www\.|m\.|music\.)?youtu\.?be(?:\.com)?\/?.*(?:watch|embed)?(?:.*v=|v\/|\/)([\w\-_]+)\&?/.test(args[0])) return m.reply(status.invalid)
  try {
    const json = await Func.fetchJson(API('alya', '/api/ytv', { url: args[0] }, 'apikey'))
    if (!json.status) return m.reply(Func.jsonFormat(json))
    let ca = `❏  *Y T - M P 4*\n\n`
    ca += ` ›  *Judul* : ` + json.title + `\n`
    ca += ` ›  *Durasi* : ` + json.duration + `\n`
    ca += ` ›  *Penonton* : ` + json.views + `\n`
    ca += ` ›  *Ukuran* : ` + json.data.size + `\n\n`
    ca += global.set.footer
    let xSize = Func.sizeLimit(json.data.size, global.set.max_upload)
    if (xSize) return m.reply(`Ukuran file (${json.data.size}) terlalu besar, silahkan download sendiri lewat link ini : ${await (await Func.shortlink(json.data.url))}`)
    conn.sendFile(m.chat, json.data.link, ca, m)
  } catch (e) {
    console.log(e)
    return m.reply(status.error)
  }
}
handler.help = ['ytmp4']
handler.tags = ['downloader']
handler.command = /^(yt(mp4|v))$/i 
handler.limit = 1 

module.exports = handler