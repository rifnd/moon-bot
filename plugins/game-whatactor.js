let timeout = 180000
let poin = 500
let tiketcoin = 1
let handler = async (m, {
  conn,
  usedPrefix
}) => {
  conn.whatactor = conn.whatactor ? conn.whatactor : {}
  let id = m.chat
  if (id in conn.whatactor) {
    conn.reply(m.chat, 'There are still unanswered questions in this chat', conn.whatactor[id][0])
    throw false
  }
  let src = await Func.fetchJson(API('alya', '/api/tebakactor', {}, 'apikey'))
  if (!src.status) return m.reply(Func.jsonFormat(src))
  let caption = `What is the name of the actor in the picture above?

Timeout *${(timeout / 1000).toFixed(2)} seconds*
Send *${usedPrefix}actorclue* for help
Bonus: ${poin} XP, ${tiketcoin} Tiketcoin`.trim()
  conn.whatactor[id] = [
    await conn.sendMessage(m.chat, {
      image: {
        url: src.data.image
      },
      caption: caption
    }, { quoted: m }),
    src,
    poin,
    setTimeout(() => {
      if (conn.whatactor[id]) conn.reply(m.chat, `Time's up!\nThe answer is *${src.data.title}*`, conn.whatactor[id][0])
      delete conn.whatactor[id]
    }, timeout)
  ]
}
handler.help = handler.command = ['whatactor']
handler.tags = ['game']
handler.limit = handler.game = handler.group = true
module.exports = handler