let timeout = 120000
let poin = Func.randomInt('1000', '50000')
let handler = async (m, {
  conn,
  usedPrefix,
  command
}) => {
  conn.lengkapikalimat = conn.lengkapikalimat ? conn.lengkapikalimat : {}
  let id = m.chat
  if (command == 'lengkapikalimat') {
    if (id in conn.lengkapikalimat) return conn.reply(m.chat, Func.texted('bold', '^ Soal ini belum dijawab.'), conn.lengkapikalimat[id][0])
    let src = await Func.fetchJson('https://raw.githubusercontent.com/qisyana/scrape/main/lengkapikalimat.json')
    let json = src[Math.floor(Math.random() * src.length)]
    let capt = `– *Lengkapi Kalimat*\n\n`
    capt += `${json.pertanyaan}\n\n`
    capt += `Timeout : ${timeout / 60 / 1000} menit\n`
    capt += `Balas pesan ini untuk menjawab, kirim ${usedPrefix}leka untuk bantuan.`
    conn.lengkapikalimat[id] = [
      await conn.reply(m.chat, capt, m),
      json,
      poin,
      setTimeout(() => {
        if (conn.lengkapikalimat[id]) conn.reply(m.chat, `Waktu habis!\nJawabannya adalah *${json.jawaban}*`, conn.lengkapikalimat[id][0])
        delete conn.lengkapikalimat[id]
      }, timeout)
    ]
  } else if (command == 'leka') {
    conn.lengkapikalimat = conn.lengkapikalimat ? conn.lengkapikalimat : {}
    if (!(id in conn.lengkapikalimat)) throw false
    let clue = conn.lengkapikalimat[id][1].jawaban.trim().replace(/[AIUEOaiueo]/g, '_')
    conn.reply(m.chat, '```' + clue + '```', m)
    console.log(clue)
  }
}
handler.help = ['lengkapikalimat']
handler.tags = ['game']
handler.command = ['lengkapikalimat', 'leka']
handler.game = handler.limit = handler.group = true
module.exports = handler