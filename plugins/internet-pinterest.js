let handler = async (m, {
  usedPrefix,
  command,
  text
}) => {
  if (!text) return m.reply(Func.texted(usedPrefix, command, 'Kucing'))
  try {
    let json = await Func.fetchJson(API('alya', '/api/pinterest', { q: text }, 'apikey'))
    if (!json.status) return m.reply(Func.jsonFormat(e))
    for (let i = 0; i < 3; i++) {
      var rand = Math.floor(json.data.length * Math.random())
      conn.sendFile(m.chat, json.data[rand].url, '', global.set.wm, m)
    }
  } catch (e) {
    console.log(e)
    return m.reply(status.error)
  }
}
handler.help = ['pinterest']
handler.tags = ['internet']
handler.command = /^(pin(terest))?$/i 
handler.limit = 1 

module.exports = handler