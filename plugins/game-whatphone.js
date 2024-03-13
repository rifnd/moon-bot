let timeout = 180000
let poin = 500
let tiketcoin = 1
let handler = async (m, {
  conn,
  usedPrefix
}) => {
  conn.whatphone = conn.whatphone ? conn.whatphone : {}
  let id = m.chat
  if (id in conn.whatphone) {
    conn.reply(m.chat, 'There are still unanswered questions in this chat', conn.whatphone[id][0])
    throw false
  }
  let src = await Func.fetchJson(API('alya', '/api/tebakphone', {}, 'apikey'))
  if (!src.status) return m.reply(Func.jsonFormat(src))
  let caption = `${src.data.question}

What country is the number from?

Timeout *${(timeout / 1000).toFixed(2)} seconds*
Send *${usedPrefix}phoneclue* for help
Bonus: ${poin} XP, ${tiketcoin} Tiketcoin`.trim()
  conn.whatphone[id] = [
    await conn.reply(m.chat, caption, m),
    src,
    poin,
    setTimeout(() => {
      if (conn.whatphone[id]) conn.reply(m.chat, `Time's up!\nThe answer is *${src.data.question}*`, conn.whatphone[id][0])
      delete conn.whatphone[id]
    }, timeout)
  ]
}
handler.help = handler.command = ['whatphone']
handler.tags = ['game']
handler.limit = handler.game = handler.group = true
module.exports = handler