let timeout = 120000
let poin = Func.randomInt('1000', '50000')
let handler = async (m, {
  conn,
  usedPrefix,
  command
}) => {
  conn.whatanimal = conn.whatanimal ? conn.whatanimal : {}
  let id = m.chat
  if (command == 'whatanimal') {
    if (id in conn.whatanimal) return conn.reply(m.chat, 'There are still unanswered questions in this chat', conn.whatanimal[id][0])
    let json = await Func.fetchJson(API('alya', '/api/tebakhewan', {}, 'apikey'))
    if (!json.status) return m.reply(Func.jsonFormat(json))
    let capt = `– *What Animal*\n\n`
    capt += `Nama hewan pada gambar ini?\n\n`
    capt += `Timeout : ${timeout / 60 / 1000} menit\n`
    capt += `Balas pesan ini untuk menjawab, kirim ${usedPrefix}animalclue untuk bantuan`
    conn.whatanimal[id] = [
      await conn.sendMessage(m.chat, {
        image: { url: src.data.image }, caption: capt
      }, { quoted: m }),
      json,
      poin,
      setTimeout(() => {
        if (conn.whatanimal[id]) conn.reply(m.chat, `Waktu Habis!\nJawabannya adalah *${json.data.title}*`, conn.whatanimal[id][0])
        delete conn.whatanimal[id]
      }, timeout)
    ]
  } else if (command == 'animalclue') {
    if (!(id in conn.whatanimal)) throw false
    let clue = conn.whatanimal[id][1].data.title.replace(/[AIUEOaiueo]/g, '_')
    conn.reply(m.chat, '```' + clue + '```', m)
  }
}
handler.help = ['whatanimal']
handler.tags = ['game']
handler.command = ['whatanimal', 'animalclue']
handler.limit = handler.game = handler.group = true
module.exports = handler