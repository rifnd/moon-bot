let handler = async (m, {
  usedPrefix,
  command,
  text,
  env
}) => {
  if (!text) return conn.reply(m.chat, Func.example(usedPrefix, command, 'moon bot'), m)
  if (text.length > 10) return m.reply(Func.texted('bold', '🚩 Max 10 kata.'))
  try {
    m.react('🕒')
    let json = await Func.fetchJson(API('alya', '/api/attp', { q: text }, 'apikey'))
    conn.sendSticker(m.chat, json.data.url, m, {
      packname: global.set.packname,
      author: global.set.author,
    })
  } catch (e) {
    console.log(e)
    return m.reply(Func.jsonFormat(e))
  }
};
handler.help = handler.command = ['attp']
handler.tags = ['sticker']
handler.limit = true
module.exports = handler