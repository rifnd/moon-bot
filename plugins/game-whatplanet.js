let timeout = 180000
let poin = 500
let tiketcoin = 1
let handler = async (m, {
  conn,
  usedPrefix
}) => {
  conn.whatplanet = conn.whatplanet ? conn.whatplanet : {}
  let id = m.chat
  if (id in conn.whatplanet) {
    conn.reply(m.chat, 'There are still unanswered questions in this chat', conn.whatplanet[id][0])
    throw false
  }
  let src = await Func.fetchJson(API('alya', '/api/tebakplanet', {}, 'apikey'))
  if (!src.status) return m.reply(Func.jsonFormat(src))
  let caption = `What is the name of the planet in the picture above?

Timeout *${(timeout / 1000).toFixed(2)} seconds*
Send *${usedPrefix}planclue* for help
Bonus: ${poin} XP, ${tiketcoin} Tiketcoin`.trim()
  conn.whatplanet[id] = [
    await conn.sendMessage(m.chat, {
      image: {
        url: src.data.image
      },
      caption: caption
    }, { quoted: m }),
    src,
    poin,
    setTimeout(() => {
      if (conn.whatplanet[id]) conn.reply(m.chat, `Time's up!\nThe answer is *${src.data.title}*`, conn.whatplanet[id][0])
      delete conn.whatplanet[id]
    }, timeout)
  ]
}
handler.help = handler.command = ['whatplanet']
handler.tags = ['game']
handler.limit = handler.game = handler.group = true
module.exports = handler