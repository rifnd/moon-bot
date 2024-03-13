let handler = async (m, {
  conn
}) => {
  conn.tebakanime = conn.tebakanime ? conn.tebakanime : {}
  let id = m.chat
  if (!(id in conn.tebakanime)) throw false
  let json = conn.tebakanime[id][1]
  let ans = json.data.title.trim()
  let clue = ans.replace(/[AIUEOaiueo]/g, '_')
  conn.reply(m.chat, '```' + clue + '```\nReply to the question, not this message', conn.tebakanime[id][0])
}
handler.command = ['nime']
handler.limit = true
module.exports = handler