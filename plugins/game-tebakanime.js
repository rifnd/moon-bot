let timeout = 180000
let poin = 500
let tiketcoin = 1
let handler = async (m, {
  conn,
  usedPrefix
}) => {
  conn.tebakanime = conn.tebakanime ? conn.tebakanime : {}
  let id = m.chat
  if (id in conn.tebakanime) {
    conn.reply(m.chat, 'There are still unanswered questions in this chat', conn.tebakanime[id][0])
    throw false
  }
  let src = await Func.fetchJson(API('alya', '/api/tebakanime', {}, 'apikey'))
  if (!src.status) return m.reply(Func.jsonFormat(src))
  let caption = `What is the name of the anime character in the picture above?

Timeout *${(timeout / 1000).toFixed(2)} milliseconds*
Send *${usedPrefix}nime* for help
Bonus: ${poin} XP, ${tiketcoin} Tiketcoin`.trim()
  conn.tebakanime[id] = [
    await conn.sendMessage(m.chat, {
      image: {
        url: src.data.image
      },
      caption: caption
    }, { quoted: m }),
    src,
    poin,
    setTimeout(() => {
      if (conn.tebakanime[id]) conn.reply(m.chat, `Time's up!\nThe answer is *${src.data.title}*`, conn.tebakanime[id][0])
      delete conn.tebakanime[id]
    }, timeout)
  ]
}
handler.help = handler.command = ['tebakanime']
handler.tags = ['game']
handler.limit = handler.game = handler.group = true
module.exports = handler