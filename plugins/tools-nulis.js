let handler = async(m, {
  usedPrefix,
  command,
  text
}) => {
  try {
    if (!text) return m.reply(Func.example(usedPrefix, command, 'moon-bot'))
    m.react('🕒')
    const json = await Func.fetchJson(API('alya', '/api/nulis', { text: text }, 'apikey'))
    if (!json.status) return m.reply(Func.jsonFormat(json))
    conn.sendFile(m.chat, json.data.url, '', global.set.wm, m)
  } catch (e) {
    console.log(e)
    return m.reply(Func.jsonFormat(e))
  }
}
handler.help = ['nulis']
handler.tags = ['tools']
handler.command = ['nulis', 'magernulis']
handler.limit = true
module.exports = handler