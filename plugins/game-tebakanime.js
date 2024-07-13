let timeout = 120000
let poin = Func.randomInt('1000', '50000')
let handler = async (m, {
  conn,
  usedPrefix,
  command
}) => {
  conn.tebakanime = conn.tebakanime ? conn.tebakanime : {}
  let id = m.chat
  if (command == 'tebakanime') {
    if (id in conn.tebakanime) return conn.reply(m.chat, 'Masih ada soal belum terjawab di chat ini', conn.tebakanime[id][0])
    let json = await Func.fetchJson(API('alya', '/api/tebakanime', {}, 'apikey'))
    if (!json.status) return m.reply(Func.jsonFormat(json))
    let capt = `– *Tebak Anime*\n\n`
    capt += `Siapakah nama karakter animek pada gambar ini??\n\n`
    capt += `Timeout : ${timeout / 60 / 1000} menit\n`
    capt += `Balas pesan ini untuk menjawab, kirim ${usedPrefix}nime untuk bantuan`
    conn.tebakanime[id] = [
      await conn.sendMessage(m.chat, {
        image: { url: json.data.image }, caption: capt
      }, { quoted: m }),
      json,
      poin,
      setTimeout(() => {
        if (conn.tebakanime[id]) conn.reply(m.chat, `Waktu habis!\nJawabannya adalah *${json.data.title}*`, conn.tebakanime[id][0])
        delete conn.tebakanime[id]
      }, timeout)
    ]
  } else if (command == 'nime') {
    if (!(id in conn.tebakanime)) throw false
    let clue = conn.tebakanime[id][1].data.title.replace(/[AIUEOaiueo]/g, '_')
    conn.reply(m.chat, '```' + clue + '```\nBalas soalnya, bukan pesan ini', conn.tebakanime[id][0])
  }
}
handler.help = ['tebakanime']
handler.tags = ['game']
handler.command = ['tebakanime', 'nime']
handler.limit = handler.group = handler.game = true
module.exports = handler