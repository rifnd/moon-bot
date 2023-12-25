let handler = async (m, {
  usedPrefix,
  command,
  text
}) => {
  try {
    if (!text) return m.reply(Func.example(usedPrefix, command, 'Halo perkenalkan dirimu'))
    m.react('🕒')
      const json = await Func.fetchJson(API('alya', '/api/cai-chat', { character_id: 'B0608QM8HK6/liya', message: text }, 'apikey'))
      if (!json.status) return m.reply(Func.jsonFormat(json))
      m.reply(json.data.content)
  } catch (e) {
    console.log(e)
    m.reply(Func.jsonFormat(e))
  }
}
handler.help = handler.command = ['cai']
handler.tags = ['internet']
handler.limit = true
module.exports = handler