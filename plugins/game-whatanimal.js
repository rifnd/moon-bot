let timeout = 180000
let poin = 500
let tiketcoin = 1
let handler = async (m, {
  conn,
  usedPrefix
}) => {
  conn.whatanimal = conn.whatanimal ? conn.whatanimal : {}
  let id = m.chat
  if (id in conn.whatanimal) {
    conn.reply(m.chat, 'There are still unanswered questions in this chat', conn.whatanimal[id][0])
    throw false
  }
  let src = await Func.fetchJson(API('alya', '/api/tebakhewan', {}, 'apikey'))
  if (!src.status) return m.reply(Func.jsonFormat(src))
  let caption = `What animal is in the picture above?

Timeout *${(timeout / 1000).toFixed(2)} seconds*
Send *${usedPrefix}animalclue* for help
Bonus: ${poin} XP, ${tiketcoin} Tiketcoin`.trim()
  conn.whatanimal[id] = [
    await conn.sendMessage(m.chat, {
      image: {
        url: src.data.image
      },
      caption: caption
    }, { quoted: m }),
    src,
    poin,
    setTimeout(() => {
      if (conn.whatanimal[id]) conn.reply(m.chat, `Time's up!\nThe answer is *${src.data.title}*`, conn.whatanimal[id][0])
      delete conn.whatanimal[id]
    }, timeout)
  ]
}
handler.help = handler.command = ['whatanimal']
handler.tags = ['game']
handler.limit = handler.game = handler.group = true
module.exports = handler