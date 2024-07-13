let timeout = 120000
let poin = Func.randomInt('1000', '50000')
let handler = async (m, {
  conn,
  usedPrefix,
  command
}) => {
  conn.tebakgame = conn.tebakgame ? conn.tebakgame : {}
  let id = m.chat
  if (command == 'tebakgame') {
    if (id in conn.tebakgame) return conn.reply(m.chat, 'Masih ada soal belum terjawab di chat ini', conn.tebakgame[id][0])
    let src = await Func.fetchJson('https://raw.githubusercontent.com/qisyana/scrape/main/tebakgame.json')
    let json = src[Math.floor(Math.random() * src.length)]
    let capt = `– *Tebak Game*\n\n`
    capt += `Paan tuh?\n\n`
    capt += `Timeout : ${timeout / 60 / 1000} menit\n`
    capt += `Balas pesan ini untuk menjawab, kirim ${usedPrefix}tega untuk bantuan`
    conn.tebakgame[id] = [
      await conn.sendMessage(m.chat, {
        image: { url: json.img }, caption: capt
      }, { quoted: m }),
      json,
      poin,
      setTimeout(() => {
        if (conn.tebakgame[id]) conn.reply(m.chat, `Waktu habis!\nJawabannya adalah *${json.jawaban}*`, conn.tebakgame[id][0])
        delete conn.tebakgame[id]
      }, timeout)
    ]
  } else if (command == 'tega') {
    if (!(id in conn.tebakgame)) throw false
    let clue = conn.tebakgame[id][1].jawaban.replace(/[AIUEOaiueo]/g, '_')
    conn.reply(m.chat, '```' + clue + '```\nBalas soalnya, bukan pesan ini', conn.tebakgame[id][0])
  }
}
handler.help = ['tebakgame']
handler.tags = ['game']
handler.command = ['tebakgame', 'tega']
handler.limit = handler.group = handler.game = true
module.exports = handler