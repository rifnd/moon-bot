let handler = async (m, {
  usedPrefix,
  command,
  args
}) => {
  try {
    if (!args[0]) return m.reply(Func.example(usedPrefix, command, 'https://v.douyin.com/ikq8axJ/'))
    if (!args[0].match(/(https:\/\/v.douyin.com)/g)) return m.reply(status.invalid)
    const json = await Func.fetchJson(API('alya', '/api/douyin', {
      url: args[0]
    }, 'apikey'))
    if (!json.status) return m.reply(Func.jsonFormat(json))
    if (command == 'douyin') {
      m.react('🕐')
      let teks = `乂  *D O U Y I N*\n\n`
      teks += `  ∘  *Title* : ${json.title}\n`
      teks += `  ∘  *Duration* : ${json.duration}\n`
      teks += `  ∘  *Media Type* : ${json.mediatype}\n`
      teks += `  ∘  *Url* : ${json.url}\n`
      let result = json.data.find(v => v.quality == 'hd')
      if (result) {
        conn.sendFile(m.chat, result.url, '', teks + `  ∘  *Quality* : ${result.quality}\n\n${global.set.footer}`, m)
      } else {
        let result = json.data.find(v => v.quality == 'sd')
        conn.sendFile(m.chat, result.url, '', teks + `  ∘  *Quality* : ${result.quality}\n\n${global.set.footer}`, m)
      }
    } else if (command == 'douyinwm') {
      m.react('🕐')
      let result = json.data.find(v => v.quality == 'watermark')
      conn.sendFile(m.chat, result.url, '', `  ∘  *Quality* : ${result.quality}\n\n${global.set.footer}`, m)
    } else if (command == 'douyinmp3') {
      m.react('🕐')
      let result = json.data.find(v => v.quality == '128kbps')
      conn.sendFile(m.chat, result.url, '', '', m)
    }
  } catch (e) {
    console.log(e)
    m.reply(Func.jsonFormat(e))
  }
}
handler.help = handler.command = ['douyin', 'douyinwm', 'douyinmp3']
handler.tags = ['downloader']
handler.limit = true
module.exports = handler