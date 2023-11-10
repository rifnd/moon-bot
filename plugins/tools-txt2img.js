let handler = async(m, {
  usedPrefix,
  command,
  text
}) => {
  try {
    if (!text) return m.reply(Func.example(usedPrefix, command, 'red car'))
    m.react('🕒')
    const json = await Func.fetchJson(API('alya', '/api/text2img', { text: text }, 'apikey'))
    if (!json.status) return m.reply(Func.jsonFormat(e))
    conn.sendFile(m.chat, json.data.images.url, '', global.set.wm, m)
  } catch (e) {
    console.log(e)
    return m.reply(Func.jsonFormat(e))
  }
}
handler.help = handler.command = ['text2img']
handler.tags = ['tools']
handler.limit = true 
module.exports = handler