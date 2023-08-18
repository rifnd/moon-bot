let handler = async (m, {
  usedPrefix,
  command,
  text
}) => {
  if (!text) return m.reply(Func.example(usedPrefix, command, 'Red hair'))
  m.react('🕐')
  try {
    const json = await Func.fetchJson(API('alya', '/api/waifu-diffusion', { prompt: text }, 'apikey'))
    if (!json.status) return m.reply(Func.jsonFormat(json))
    conn.sendFile(m.chat, json.data.url, '', set.wm, m)
  } catch (e) {
    console.log(e)
    return m.reply(status.error)
  }
}
handler.help = ['waifudiff']
handler.tags = ['internet']
handler.command = /^waifudiff(usion)?$/i
handler.limit = 1

module.exports = handler