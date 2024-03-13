let timeout = 180000
let poin = 500
let tiketcoin = 1
let handler = async (m, {
  conn,
  usedPrefix
}) => {
  conn.whatmarvel = conn.whatmarvel ? conn.whatmarvel : {}
  let id = m.chat
  if (id in conn.whatmarvel) {
    conn.reply(m.chat, 'There are still unanswered questions in this chat', conn.whatmarvel[id][0])
    throw false
  }
  let src = await Func.fetchJson(API('alya', '/api/tebakmarvel', {}, 'apikey'))
  if (!src.status) return m.reply(Func.jsonFormat(src))
  let caption = `What is the name of the marvel superhero in the picture above?

Timeout *${(timeout / 1000).toFixed(2)} seconds*
Send *${usedPrefix}marv* for help
Bonus: ${poin} XP, ${tiketcoin} Tiketcoin`.trim()
  conn.whatmarvel[id] = [
    await conn.sendMessage(m.chat, {
      image: {
        url: src.data.image
      },
      caption: caption
    }, { quoted: m }),
    src,
    poin,
    setTimeout(() => {
      if (conn.whatmarvel[id]) conn.reply(m.chat, `Time's up!\nThe answer is *${src.data.title}*`, conn.whatmarvel[id][0])
      delete conn.whatmarvel[id]
    }, timeout)
  ]
}
handler.help = handler.command = ['whatmarvel']
handler.tags = ['game']
handler.limit = handler.game = handler.group = true
module.exports = handler