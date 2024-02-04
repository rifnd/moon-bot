const fs = require('fs')
let handler = async (m, {
  usedPrefix,
  command,
  text
}) => {
  try {
    if (!text) return m.reply(Func.example(usedPrefix, command, 'fun-menfess'))
    let path = `plugins/${text}.js`
    if (!fs.existsSync(path)) return m.reply(`${text}.js plugin file not found`)
    fs.unlinkSync(path)
    m.reply(`${text}.js plugin file successfully deleted`)
  } catch (e) {
    console.log(e)
    return m.reply(Func.jsonFormat(e))
  }
}
handler.help = ['delplug']
handler.tags = ['owner']
handler.command = /^(dp|delplug|deleteplugins)$/i
handler.owner = true
module.exports = handler