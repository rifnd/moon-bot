let timeout = 120000
let poin = Func.randomInt('1000', '50000')
let handler = async (m, {
  conn,
  usedPrefix,
  command
}) => {
  conn.susunkata = conn.susunkata ? conn.susunkata : {}
  let id = m.chat
  if (command == 'susunkata') {
    if (id in conn.susunkata) return conn.reply(m.chat, 'Masih ada soal belum terjawab di chat ini', conn.susunkata[id][0])
    let src = await Func.fetchJson('https://raw.githubusercontent.com/BochilTeam/database/master/games/susunkata.json')
    let json = src[Math.floor(Math.random() * src.length)]
    let capt = `– *Susun Kata*\n\n`
    capt += `${json.soal}\n\n`
    capt += `Tipe : ${json.tipe}\n`
    capt += `Timeout : ${timeout / 60 / 1000} menit\n`
    capt += `Balas pesan ini untuk menjawab, kirim ${usedPrefix}suska untuk bantuan`
    conn.susunkata[id] = [
      await conn.reply(m.chat, capt, m),
      json,
      poin,
      setTimeout(() => {
        if (conn.susunkata[id]) conn.reply(m.chat, `Waktu habis!\nJawabannya adalah *${json.jawaban}*`, conn.susunkata[id][0])
        delete conn.susunkata[id]
      }, timeout)
    ]
  } else if (command == 'suska') {
    if (!(id in conn.susunkata)) throw false
    let clue = conn.susunkata[id][1].jawaban.replace(/[AIUEOaiueo]/g, '_')
    conn.reply(m.chat, '```' + clue + '```\nBalas soalnya, bukan pesan ini', conn.susunkata[id][0])
  }
}
handler.help = ['susunkata']
handler.tags = ['game']
handler.command = ['susunkata', 'suska']
handler.limit = handler.group = handler.game = true
module.exports = handler