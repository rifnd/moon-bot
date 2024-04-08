let handler = async (m, {
  usedPrefix,
  command,
  args
}) => {
  try {
    if (!args[0]) return m.reply(Func.example(usedPrefix, command, 'https://v.douyin.com/ikq8axJ/'))
    if (!args[0].match(/(https:\/\/v.douyin.com)/g)) return m.reply(status.invalid)
    const json = await Func.fetchJson(API('alya', '/api/douyin', { url: args[0] }, 'apikey'))
    if (!json.status) return m.reply(Func.jsonFormat(json))
    if (command == 'douyin') {
      m.react('🕐')
      let teks = `乂  *D O U Y I N*\n\n`
      teks += `  ∘  *Title* : ${json.title}\n`
      teks += `  ∘  *Duration* : ${json.duration}\n`
      teks += `  ∘  *Comment* : ${json.statistic.comment}\n`
      teks += `  ∘  *Like* : ${json.statistic.likes}\n`
      teks += `  ∘  *Download* : ${json.statistic.download}\n`
      teks += `  ∘  *Share* : ${json.statistic.share}\n\n`
      teks += global.set.footer
      let result = json.data.find(v => v.quality == 'nowatermark')
      conn.sendMessage(m.chat, { video: { url: result.url }, caption: teks, mimetype: 'video/mp4' }, { quoted: m })
    } else if (command == 'douyinwm') {
      m.react('🕐')
      let result = json.data.find(v => v.quality == 'watermark')
      conn.sendMessage(m.chat, { video: { url: result.url }, caption: teks, mimetype: 'video/mp4' }, { quoted: m })
    } else if (command == 'douyinmp3') {
      m.react('🕐')
      conn.sendMessage(m.chat, { audio: { url: json.music_info.url }, mimetype: 'audio/mpeg' }, { quoted: m })
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