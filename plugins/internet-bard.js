let handler = async (m, {
  usedPrefix,
  command,
  text
}) => {
  try {
    if (!text) return m.reply(Func.example(usedPrefix, command, 'kucing'))
    m.react('🕐')
    const json = await Func.fetchJson(API('alya', '/api/bard-google-ai', { q: text }, 'apikey'))
    if (!json.status) return m.reply(Func.jsonFormat(json))
    m.reply(json.data.chats)
  } catch (e) {
    console.log(e)
    m.reply(status.error)
  }
}
handler.help = handler.command = ['bard']
handler.tags = ['internet']
handler.limit = true
module.exports = handler