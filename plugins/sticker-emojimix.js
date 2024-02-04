let handler = async (m, { 
  conn, 
  usedPrefix, 
  command, 
  text
}) => {
  if (!text) return m.reply(Func.example(usedPrefix, command, '🥵 + 🥶'))
  m.react('🕒')
  try {
    var [emoji1, emoji2] = text.split` + `
    const json = await Func.fetchJson(API('alya', '/api/emomix', {
      emo_a: emoji1,
      emo_b: emoji2
    }, 'apikey'))
    if (!json.status) return m.reply(Func.jsonFormat(json))
    conn.sendSticker(m.chat, json.data.url, m, { 
      packname: global.set.packname, 
      author: global.set.author
    })
  } catch (e) {
    console.log(e)
    return m.reply('emoji is not supported, change emoji position')
  }
}
handler.help = ['emojimix']
handler.tags = ['sticker']
handler.command = /^(emojimix|emomix)$/i
handler.limit = true
module.exports = handler