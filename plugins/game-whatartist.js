let timeout = 180000
let poin = 500
let tiketcoin = 1
let handler = async (m, {
  conn,
  usedPrefix
}) => {
  conn.whatartist = conn.whatartist ? conn.whatartist : {}
  let id = m.chat
  if (id in conn.whatartist) {
    conn.reply(m.chat, 'There are still unanswered questions in this chat', conn.whatartist[id][0])
    throw false
  }
  let src = await Func.fetchJson(API('alya', '/api/tebakartist', {}, 'apikey'))
  if (!src.status) return m.reply(Func.jsonFormat(src))
  let caption = `What is the name of the artist in the picture above?

Timeout *${(timeout / 1000).toFixed(2)} seconds*
Send *${usedPrefix}artistclue* for help
Bonus: ${poin} XP, ${tiketcoin} Tiketcoin`.trim()
  conn.whatartist[id] = [
    await conn.sendMessage(m.chat, {
      image: {
        url: src.data.image
      },
      caption: caption
    }, { quoted: m }),
    src,
    poin,
    setTimeout(() => {
      if (conn.whatartist[id]) conn.reply(m.chat, `Time's up!\nThe answer is *${src.data.title}*`, conn.whatartist[id][0])
      delete conn.whatartist[id]
    }, timeout)
  ]
}
handler.help = handler.command = ['whatartist']
handler.tags = ['game']
handler.limit = handler.game = handler.group = true
module.exports = handler