let handler = async (m, {
  usedPrefix,
  command,
  text
}) => {
  if (!text) return m.reply(Func.texted(usedPrefix, command, 'Kucing'))
  try {
    let json = await Func.fetchJson(API('alya', '/api/pinterest', { q: text }, 'apikey'))
    if (!json.status) return m.reply(Func.jsonFormat(e))
    m.react('🕐')
    let old = new Date()
    for (let i = 0; i < 3; i++) {
      var rand = Math.floor(json.data.length * Math.random())
      conn.sendFile(m.chat, json.data[rand].url, '', `• *Fetching* : ${((new Date - old) * 1)} ms`, m)
    }
  } catch (e) {
    console.log(e)
    return m.reply(status.error)
  }
}
handler.help = handler.command = ['pinterest']
handler.tags = ['internet']
handler.limit = 1 
module.exports = handler