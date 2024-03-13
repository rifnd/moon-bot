let handler = async (m, {
  conn
}) => {
  conn.whatplanet = conn.whatplanet ? conn.whatplanet : {}
  let id = m.chat
  if (!(id in conn.whatplanet)) throw false
  let json = conn.whatplanet[id][1]
  let ans = json.data.title.trim()
  let clue = ans.replace(/[AIUEOaiueo]/g, '_')
  conn.reply(m.chat, '```' + clue + '```\nReply to the question, not this message', conn.whatplanet[id][0])
}
handler.command = ['planclue']
handler.limit = true
module.exports = handler