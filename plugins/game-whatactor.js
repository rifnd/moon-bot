let timeout = 120000
let poin = Func.randomInt('1000', '50000')
let handler = async (m, {
  conn,
  usedPrefix,
  command
}) => {
  conn.whatactor = conn.whatactor ? conn.whatactor : {}
  let id = m.chat
  if (command == 'whatactor') {
    if (id in conn.whatactor) return conn.reply(m.chat, 'There are still unanswered questions in this chat', conn.whatactor[id][0])
    let json = await Func.fetchJson(API('alya', '/api/tebakactor', {}, 'apikey'))
    if (!json.status) return m.reply(Func.jsonFormat(json))
    let capt = `– *What Actor*\n\n`
    capt += `Siapa nama aktor pada gambar ini?\n\n`
    capt += `Timeout : ${timeout / 60 / 1000} menit\n`
    capt += `Balas pesan ini untuk menjawab, kirim ${usedPrefix}actorclue untuk bantuan`
    conn.whatactor[id] = [
      await conn.sendMessage(m.chat, {
        image: { url: src.data.image }, caption: caption
      }, { quoted: m }),
      json,
      poin,
      setTimeout(() => {
        if (conn.whatactor[id]) conn.reply(m.chat, `Waktu habis!\nJawabannya adalah *${json.data.title}*`, conn.whatactor[id][0])
        delete conn.whatactor[id]
      }, timeout)
    ]
  } else if (command == 'actorclue') {
    if (!(id in conn.whatactor)) throw false
    let clue = conn.whatactor[id][1].data.title.replace(/[AIUEOaiueo]/g, '_')
    conn.reply(m.chat, '```' + clue + '```\n', m)
  }
}
handler.help = ['whatactor']
handler.tags = ['game']
handler.command = ['whatactor', 'actorclue']
handler.limit = handler.game = handler.group = true
module.exports = handler