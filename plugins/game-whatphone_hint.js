let handler = async (m, {
  conn
}) => {
  conn.whatphone = conn.whatphone ? conn.whatphone : {}
  let id = m.chat
  if (!(id in conn.whatphone)) throw false
  let json = conn.whatphone[id][1]
  let ans = json.data.answer.trim()
  let clue = ans.replace(/[AIUEOaiueo]/g, '_')
  conn.reply(m.chat, '```' + clue + '```\nReply to the question, not this message', conn.whatphone[id][0])
}
handler.command = ['phoneclue']
handler.limit = true
module.exports = handler