let handler = async (m, {
  usedPrefix,
  command,
  text
}) => {
  try {
    if (!text) return m.reply(Func.example(usedPrefix, command, 'alay'))
    m.react('🕐')
    const json = await Func.fetchJson(API('alya', '/api/kbbg', { q: text }, 'apikey'))
    if (!json.status) return m.reply(Func.jsonFormat(json))
    m.reply(json.data.description)
  } catch (e) {
    console.log(e)
    m.reply(Func.jsonFormat(e))
  }
}
handler.help = handler.command = ['kbbg']
handler.tags = ['internet']
handler.limit = true
module.exports = handler