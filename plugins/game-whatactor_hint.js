let handler = async (m, {
  conn
}) => {
  conn.whatactor = conn.whatactor ? conn.whatactor : {}
  let id = m.chat
  if (!(id in conn.whatactor)) throw false
  let json = conn.whatactor[id][1]
  let ans = json.data.title.trim()
  let clue = ans.replace(/[AIUEOaiueo]/g, '_')
  conn.reply(m.chat, '```' + clue + '```\nReply to the question, not this message', conn.whatactor[id][0])
}
handler.command = ['actorclue']
handler.limit = true
module.exports = handler