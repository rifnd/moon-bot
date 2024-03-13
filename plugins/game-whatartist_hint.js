let handler = async (m, {
  conn
}) => {
  conn.whatartist = conn.whatartist ? conn.whatartist : {}
  let id = m.chat
  if (!(id in conn.whatartist)) throw false
  let json = conn.whatartist[id][1]
  let ans = json.data.title.trim()
  let clue = ans.replace(/[AIUEOaiueo]/g, '_')
  conn.reply(m.chat, '```' + clue + '```\nReply to the question, not this message', conn.whatartist[id][0])
}
handler.command = ['artistclue']
handler.limit = true
module.exports = handler