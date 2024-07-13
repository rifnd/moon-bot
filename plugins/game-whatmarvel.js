let timeout = 120000
let poin = Func.randomInt('1000', '50000')
let handler = async (m, {
  conn,
  usedPrefix,
  command
}) => {
  conn.whatmarvel = conn.whatmarvel ? conn.whatmarvel : {}
  let id = m.chat
  if (command == 'whatmarvel') {
    if (id in conn.whatmarvel) return conn.reply(m.chat, 'There are still unanswered questions in this chat', conn.whatmarvel[id][0])
    let json = await Func.fetchJson(API('alya', '/api/tebakmarvel', {}, 'apikey'))
    if (!json.status) return m.reply(Func.jsonFormat(json))
    let capt = `– *What Marvel*\n\n`
    capt += `Siapa superhero pada gambar ini?\n\n`
    capt += `Timeout : ${timeout / 60 / 1000} menit\n`
    capt += `Balas pesan ini untuk menjawab, kirim ${usedPrefix}marv untuk bantuan`
    conn.whatmarvel[id] = [
      await conn.sendMessage(m.chat, {
        image: { url: src.data.image }, caption: capt
      }, { quoted: m }),
      json,
      poin,
      setTimeout(() => {
        if (conn.whatmarvel[id]) conn.reply(m.chat, `Time's up!\nThe answer is *${json.data.title}*`, conn.whatmarvel[id][0])
        delete conn.whatmarvel[id]
      }, timeout)
    ]
  } else if (command == 'marv') {
    if (!(id in conn.whatmarvel)) throw false
    let clue = conn.whatmarvel[id][1].data.title.replace(/[AIUEOaiueo]/g, '_')
    conn.reply(m.chat, '```' + clue + '```', m)
  }
}
handler.help = ['whatmarvel']
handler.tags = ['game']
handler.command = ['whatmarvel', 'marv']
handler.limit = handler.game = handler.group = true
module.exports = handler