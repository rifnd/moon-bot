let timeout = 120000
let poin = Func.randomInt('1000', '50000')
let handler = async (m, {
  conn,
  usedPrefix,
  command
}) => {
  conn.tebaklirik = conn.tebaklirik ? conn.tebaklirik : {}
  let id = m.chat
  if (command == 'tebaklirik') {
    if (id in conn.tebaklirik) return conn.reply(m.chat, 'Masih ada soal belum terjawab di chat ini', conn.tebaklirik[id][0])
    let res = await Func.fetchJson('https://raw.githubusercontent.com/BochilTeam/database/master/games/tebaklirik.json')
    let json = res[Math.floor(Math.random() * res.length)]
    let capt = `– *Tebak Lirik*\n\n`
    capt += `${json.soal}\n\n`
    capt += `Timeout : ${timeout / 60 / 1000} menit\n`
    capt += `Balas pesan ini untuk menjawab, kirim ${usedPrefix}teli untuk bantuan`
    conn.tebaklirik[id] = [
      await conn.reply(m.chat, capt, m),
      json,
      poin,
      setTimeout(() => {
        if (conn.tebaklirik[id]) conn.reply(m.chat, `Waktu habis!\nJawabannya adalah *${json.jawaban}*`, conn.tebaklirik[id][0])
        delete conn.tebaklirik[id]
      }, timeout)
    ]
  } else if (command == 'teli') {
    if (!(id in conn.tebaklirik)) throw false
    let clue = conn.tebaklirik[id][1].jawaban.replace(/[AIUEOaiueo]/g, '_')
    conn.reply(m.chat, '```' + clue + '```\nBalas soalnya, bukan pesan ini', conn.tebaklirik[id][0])
  }
}
handler.help = ['tebaklirik']
handler.tags = ['game']
handler.command = ['tebaklirik', 'teli']
handler.limit = handler.group = handler.game = true
module.exports = handler