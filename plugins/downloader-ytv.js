const axios = require('axios')
let handler = async (m, {
  usedPrefix,
  command,
  args
}) => {
  if (!args[0]) return m.reply(Func.example(usedPrefix, command, 'https://youtube.com/watch?v=-BaHui7--ak'))
  if (!/^(?:https?:\/\/)?(?:www\.|m\.|music\.)?youtu\.?be(?:\.com)?\/?.*(?:watch|embed)?(?:.*v=|v\/|\/)([\w\-_]+)\&?/.test(args[0])) return m.reply(status.invalid)
  m.react('🕛')
  try {
    const json = await Func.fetchJson(API('alya', '/api/ytv', { url: args[0] }, 'apikey'))
    if (!json.status) return m.reply(Func.jsonFormat(json))
    let ca = `乂  *Y T - M P 4*\n\n`
    ca += `  ∘  *Title* : ` + json.title + `\n`
    ca += `  ∘  *Duration* : ` + json.duration + `\n`
    ca += `  ∘  *Viewer* : ` + json.views + `\n`
    ca += `  ∘  *Size* : ` + json.data.size + `\n\n`
    ca += global.set.footer
    let xSize = Func.sizeLimit(json.data.size, global.max_upload)
    if (xSize.oversize) return m.reply(`The file size (${json.data.size}) is too large, please download it yourself via this link : ${json.data.url}`)
    // Document
    /*conn.sendMessage(m.chat, {
      document: { url: json.data.url },
      caption: ca,
      fileName: json.title + '.mp4',
      mimetype: 'video/mp4'
    }, { quoted: m })*/
    // Video
    conn.sendMessage(m.chat, { 
      video: { url: json.data.url },
      caption: ca,
      fileName: json.title + '.mp4', 
      mimetype: 'video/mp4'
    }, { quoted: m })
  } catch (e) {
    console.log(e)
    return m.reply(Func.jsonFormat(e))
  }
}
handler.help = ['ytmp4']
handler.tags = ['downloader']
handler.command = ['ytv', 'ytmp4']
handler.limit = 1
module.exports = handler