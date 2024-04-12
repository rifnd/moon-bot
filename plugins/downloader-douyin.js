let handler = async (m, {
  conn,
  usedPrefix,
  command,
  args
}) => {
  try {
    if (!args[0]) return m.reply(Func.example(usedPrefix, command, 'https://v.douyin.com/ikq8axJ/'))
    if (!args[0].match(/(https:\/\/v.douyin.com)/g)) return m.reply(status.invalid)
    m.react('🕐')
    let old = new Date()
    const json = await Func.fetchJson(API('alya', '/api/douyin', { url: args[0] }, 'apikey'))
    if (!json.status) return m.reply(Func.jsonFormat(json))
    if (command == 'douyin') {
      let result = json.data.find(v => v.quality == 'nowatermark')
      if (!result) {
        json.data.map(x => {
          conn.sendFile(m.chat, x.url, '', `◦ *Fetching* : ${((new Date - old) * 1)} ms`, m)
        })
      } else {
        conn.sendFile(m.chat, result.url, '', `◦ *Fetching* : ${((new Date - old) * 1)} ms`, m)
      }
    } else if (command == 'douyinwm') {
      conn.sendFile(m.chat, json.data.find(v => v.quality == 'watermark'), Func.filename('mp4'), `◦ *Fetching* : ${((new Date - old) * 1)} ms`, m)
    } else if (command == 'douyinmp3') {
      conn.sendFile(m.chat, json.music_info.url, Func.filename('mp3'), ``, m)
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