let handler = async (m, {
  conn
}) => {
  conn.whatmarvel = conn.whatmarvel ? conn.whatmarvel : {}
  let id = m.chat
  if (!(id in conn.whatmarvel)) throw false
  let json = conn.whatmarvel[id][1]
  let ans = json.data.title.trim()
  let clue = ans.replace(/[AIUEOaiueo]/g, '_')
  conn.reply(m.chat, '```' + clue + '```\nReply to the question, not this message', conn.whatmarvel[id][0])
}
handler.command = ['marv']
handler.limit = true
module.exports = handler