/*const yts = require('yt-search')
let handler = async (m, {
  text,
  usedPrefix,
  command
}) => {
  try {
    if (!text) return conn.reply(m.chat, Func.example(usedPrefix, command, 'Utopia'), m)
    let yt = await (await yts(text)).all
    if (yt.length == 0) return conn.reply(m.chat, Func.jsonFormat(yt), m)
    let teks = `乂  *Y T - S E A R C H*\n\n`
    yt.map((v, i) => {
      if (i < 8) {
        teks += `*` + (i + 1) + `*. ` + v.title + `\n`
        teks += `  ∘  *Durasi* : ` + v.timestamp + `\n`
        teks += `  ∘  *Penonton* : ` + v.views + `\n`
        teks += `  ∘  *Upload* : ` + v.ago + `\n`
        teks += `  ∘  *Url* : ` + v.url + `\n\n`
      }
    })
    m.reply(teks + global.set.footer)
  } catch (e) {
    console.log(e)
    return conn.reply(m.chat, status.error, m)
  }
}
handler.help = ['ytsearch']
handler.tags = ['internet']
handler.command = ['yts', 'ytsearch']
module.exports = handler*/

const yts = require('yt-search')
let handler = async (m, {
  text,
  usedPrefix,
  command
}) => {
  try {
    if (!text) return conn.reply(m.chat, Func.example(usedPrefix, command, 'Utopia'), m)
    let yt = await (await yts(text)).all
    if (yt.length == 0) return conn.reply(m.chat, Func.jsonFormat(yt), m)
    yt.filter(p => p.type == 'video').map(async (v, i) => {
      if (i < 5) {
        let teks = ` 乂  *Y T - S E A R C H*\n\n`
        teks += `*` + (i + 1) + `*. ` + v.title + `\n`
        teks += `  ∘  Durasi : ` + v.timestamp + `\n`
        teks += `  ∘  Penonton : ` + v.views + `\n`
        teks += `  ∘  Upload : ` + v.ago + `\n`
        teks += `  ∘  Url : ` + v.url + `\n\n`
        let buttons = [{
          name: 'quick_reply',
          buttonParamsJson: JSON.stringify({
            display_text: 'Audio',
            id: `${usedPrefix}yta ${v.url}`
          })
        }, {
          name: 'quick_reply',
          buttonParamsJson: JSON.stringify({
            display_text: 'Video',
            id: `${usedPrefix}ytv ${v.url}`
          })
        }]
        await conn.sendAIMessage(m.chat, buttons, m, {
          header: '',
          content: teks,
          footer: global.set.footer,
          media: v.thumbnail
        })
      }
    })
    //  m.reply(teks + global.set.footer)
  } catch (e) {
    console.log(e)
    return conn.reply(m.chat, status.error, m)
  }
}
handler.help = ['ytsearch']
handler.tags = ['internet']
handler.command = ['yts', 'ytsearch']
module.exports = handler