let handler = async (m, {
  usedPrefix,
  command,
  text,
  setting
}) => {
  try {
    if (!text) return conn.reply(m.chat, Func.example(usedPrefix, command, setting.link), m)
    const isUrl = Func.isUrl(text)
    if (!isUrl) return conn.reply(m.chat, Func.texted('bold', `URL is invalid.`), m)
    setting.link = text
    conn.reply(m.chat, Func.texted('bold', `Link successfully set.`), m)
 } catch (e) {
    conn.reply(m.chat, Func.jsonFormat(e), m)
 }
}
handler.help = handler.command = ['setlink']
handler.tags = ['owner']
handler.owner = 1
module.exports = handler