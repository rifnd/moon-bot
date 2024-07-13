let timeout = 120000
let poin = Func.randomInt('1000', '50000')
let handler = async (m, {
  conn,
  usedPrefix,
  command
}) => {
  conn.tekateki = conn.tekateki ? conn.tekateki : {}
  let id = m.chat
  if (command == 'tekateki') {
    if (id in conn.tekateki) return conn.reply(m.chat, 'Masih ada soal belum terjawab di chat ini', conn.tekateki[id][0])
    let src = await Func.fetchJson('https://raw.githubusercontent.com/qisyana/scrape/main/tekateki.json')
    let json = src[Math.floor(Math.random() * src.length)]
    let capt = `– *Teka Teki*\n\n`
    capt += `${json.pertanyaan}\n\n`
    capt += `Timeout : ${timeout / 60 / 1000} menit\n`
    capt += `Balas pesan ini untuk menjawab, kirim ${usedPrefix}tekki untuk bantuan`
    conn.tekateki[id] = [
      await conn.reply(m.chat, capt, m),
      json,
      poin,
      setTimeout(() => {
        if (conn.tekateki[id]) conn.reply(m.chat, `Waktu habis!\nJawabannya adalah *${json.jawaban}*`, conn.tekateki[id][0])
        delete conn.tekateki[id]
      }, timeout)
    ]
  } else if (command == 'tekki') {
    if (!(id in conn.tekateki)) throw false
    let clue = conn.tekateki[id][1].jawaban.replace(/[AIUEOaiueo]/g, '_')
    conn.reply(m.chat, '```' + clue + '```\nBalas soalnya, bukan pesan ini', conn.tekateki[id][0])
  }
}
handler.help = ['tekateki']
handler.tags = ['game']
handler.command = ['tekateki', 'tekki']
handler.limit = handler.group = handler.game = true
module.exports = handler