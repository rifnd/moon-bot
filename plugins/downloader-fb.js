let handler = async (m, {
  usedPrefix,
  command,
  args
}) => {
  if (!args[0]) return m.reply(Func.example(usedPrefix, command, 'https://fb.watch/mdAicxI4P9/'))
  if (!args[0].match(/(?:https?:\/\/(web\.|www\.|m\.)?(facebook|fb)\.(com|watch)\S+)?$/)) return m.reply(status.invalid);
  m.react('🕐')
  try {
    const json = await Func.fetchJson(API('alya', '/api/fb', { url: args[0] }, 'apikey'))
    if (!json.status) return m.reply(Func.jsonFormat(json))
    var result = json.data.find(v => v.quality == 'HD') || json.data.find(v => v.quality == 'SD')
    await conn.sendMedia(m.chat, result.url, m, {
      caption: `• Quality : ${result.quality}`
    })
  } catch (e) {
    console.log(e)
    return m.reply(Func.jsonFormat(e))
  }
}
handler.help = ['facebook']
handler.tags = ['downloader']
handler.command = ['fb', 'facebook']
handler.limit = 1
module.exports = handler