const axios = require('axios')
let handler = async (m, {
  usedPrefix,
  command,
  args
}) => {
  if (!args[0]) return m.reply(Func.example(usedPrefix, command, 'https://youtube.com/watch?v=-BaHui7--ak'))
  if (!/^(?:https?:\/\/)?(?:www\.|m\.|music\.)?youtu\.?be(?:\.com)?\/?.*(?:watch|embed)?(?:.*v=|v\/|\/)([\w\-_]+)\&?/.test(args[0])) return m.reply(status.invalid)
  m.react('🕐')
  try {
    const json = await Func.fetchJson(API('alya', '/api/yta', { url: args[0] }, 'apikey'))
    if (!json.status) return m.reply(Func.jsonFormat(json))
    let ca = `乂  *Y T - M P 3*\n\n`
    ca += ` ∘  *Title* : ` + json.title + `\n`
    ca += ` ∘  *Duration* : ` + json.duration + `\n`
    ca += ` ∘  *Viewer* : ` + json.views + `\n`
    ca += ` ∘  *Size* : ` + json.data.size + `\n\n`
    ca += global.set.footer
    let xSize = Func.sizeLimit(json.data.size, global.max_upload)
    if (xSize.oversize) return m.reply(`Ukuran file (${json.data.size}) terlalu besar, silahkan download sendiri lewat link ini : ${await (await Func.shortlink(json.data.url))}`)
    conn.sendMessageModify(m.chat, ca, m, {
      largeThumb: true,
      thumbnail: json.thumbnail
    }).then(async () => {
      // document
      conn.sendMessage(m.chat, {
        document: {
          url: json.data.url
        },
        mimetype: 'audio/mp3',
        fileName: json.title + '.mp3'
      }, {
        quoted: m
      })
      // audio
      /*conn.sendMedia(m.chat, json.data.url, m, {
        filename: json.title + '.mp3',
        mentions: [m.sender]
      })*/
    })
  } catch (e) {
    console.log(e)
    return m.reply(status.error)
  }
}
handler.help = ['ytmp3']
handler.tags = ['downloader']
handler.command = ['yta', 'ytmp3']
handler.limit = 1
module.exports = handler