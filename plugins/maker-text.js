let handler = async (m, {
  usedPrefix,
  command,
  text
}) => {
  try {
    if (!text) return m.reply(Func.example(usedPrefix, command, 'moon-bot'))
    if (text.length > 8) return m.reply(`Teks terlalu panjang.`)
    m.react('🕛')
    let old = new Date()
    const json = await Func.fetchJson(API('alya', '/api/' + command.toLowerCase(), { text: text }, 'apikey'))
    if (!json.status) return m.reply(Func.jsonFormat(json))
    conn.sendFile(m.chat, json.data.url, 'maker.jpg', `• *Process* : ${((new Date - old) * 1)} ms`, m)
  } catch (e) {
    console.log(e)
    return m.reply(status.error)
  }
}
handler.help = handler.command = ['flaming', 'shadow', 'metallic', 'neondrak', 'neonglow', 'rainbow', 'graffiti', 'vintage', 'gradient', 'illuminated']
handler.tags = ['maker']
handler.limit = true

module.exports = handler