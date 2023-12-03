let handler = async (m, {
  usedPrefix,
  command,
  text
}) => {
  try {
    if (!text) return m.reply(Func.jsobFormat(usedPrefix, command, 'girl pink hair'))
    m.react('🕒')
    const json = await Func.fetchJson(API('alya', '/api/diffusion4', { prompt: text, model: 'real' }, 'apikey'))
    if (!json.status) return m.reply(Func.jsonFormat(json))
    conn.sendFile(m.chat, json.data.images.url, '', json.data.prompt, m)
  } catch (e) {
    console.log(e)
    return m.reply(Func.jsonFormat(e))
  }
}
handler.help = handler.command = ['nsfwdiffusion']
handler.tags = ['internet']
handler.limit = true
module.exports = handler