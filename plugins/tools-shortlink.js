let handler = async (m, { 
  conn,
  usedPrefix, 
  command, 
  args
}) => {
  if (!args[0]) return m.reply(Func.example(usedPrefix, command, 'https://api.alyachan.pro'))
  if (!Func.isUrl(args[0])) return m.reply(status.invalid)
  m.react('🕒')
  try {
    const json = await Func.fetchJson(API('alya', '/api/shorten', { url: args[0] }, 'apikey'))
    if (!json.status) return m.reply(Func.jsonFormat(json))
    await m.reply(Func.jsonFormat(json))
  } catch (e) {
    console.log(e)
    return m.reply(Func.jsonFormat(e))
  }
}
handler.help = ['shortlink'].map(v => v + ' ')
handler.tags = ['tools']
handler.command = /^(shortlink|short|shorturl)$/i
handler.limit = true
module.exports = handler