let handler = async (m, {
  usedPrefix,
  command,
  text
}) => {
  try {
    if (!text) return m.reply(Func.example(usedPrefix, command,
      'sunset'))
    m.react('🕐')
    const json = await Func.fetchJson(API('alya', '/api/wallpaper', { q: text }, 'apikey'))
    if (!json.status) return m.reply(Func.jsonFormat(json))
    for (let i = 0; i < 5; i++) {
      let ran = Math.floor(json.data.length * Math.random())
      let cap = `–  *W A L L P A P E R*\n\n`
      cap += `  ∘  *Size* : ` + json.data[ran].size + `\n`
      cap += `  ∘  *Dimension* : ` + json.data[ran].size + `\n`
      cap += `  ∘  *Keyword* : ` + json.data[ran].keywords + `\n\n`
      cap += global.set.footer
      conn.sendFile(m.chat, json.data[ran].url, '', cap, m)
      await Func.delay(3000)
    }
  } catch (e) {
    console.log(e)
    m.reply(Func.jsonFormat(e))
  }
}
handler.help = handler.command = ['wallpaper']
handler.tags = ['internet']
handler.limit = 1
module.exports = handler