let handler = async (m, {
  conn
}) => {
  conn.whatanimal = conn.whatanimal ? conn.whatanimal : {}
  let id = m.chat
  if (!(id in conn.whatanimal)) throw false
  let json = conn.whatanimal[id][1]
  let ans = json.data.title.trim()
  let clue = ans.replace(/[AIUEOaiueo]/g, '_')
  conn.reply(m.chat, '```' + clue + '```\nReply to the question, not this message', conn.whatanimal[id][0])
}
handler.command = ['animalclue']
handler.limit = true
module.exports = handler