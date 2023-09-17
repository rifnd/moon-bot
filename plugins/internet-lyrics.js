let handler = async (m, {
  usedPrefix,
  command,
  text
}) => {
  try {
    if (!text) return m.reply(Func.example(usedPrefix, command, 'satu satu'))
    m.react('🕐')
    const res = await Func.fetchJson(API('alya', '/api/lirik', { q: text }, 'apikey'))
    if (!res.status) return m.reply(Func.jsonFormat(res))
    m.reply(res.data.lyrics)
    console.log(json)
  } catch (e) {
    console.log(e)
    return m.reply(Func.jsonFormat(e))
  }
}
handler.help = ['lyrics']
handler.tags = ['internet']
handler.command = /^(lyrics|lirik)$/i
handler.limit = 1
module.exports = handler