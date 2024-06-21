let handler = async (m, {
  usedPrefix,
  command,
  text
}) => {
  if (!text) return m.reply(Func.example(usedPrefix, command, 'Kucing nakal'))
  m.reply(status.wait)
  try {
    let json = await Func.fetchJson(API('alya', '/api/dokterai', { text: text }, 'apikey'))
    if (!json.status) return m.reply(Func.jsonFormat(json))
    m.reply(json.data.content)
  } catch (e) {
    console.log(e)
    return m.reply(status.error)
  }
}
handler.help = handler.command = ['ai-dokter']
handler.tags = ['tools']
handler.limit = true
module.exports = handler