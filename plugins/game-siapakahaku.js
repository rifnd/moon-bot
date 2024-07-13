let timeout = 120000
let poin = Func.randomInt('1000', '50000')
let handler = async (m, {
  usedPrefix,
  command
}) => {
  conn.siapakahaku = conn.siapakahaku ? conn.siapakahaku : {}
  let id = m.chat
  if (command == 'siapakahaku') {
    if (id in conn.siapakahaku) return conn.reply(m.chat, Func.texted('bold', '^ Soal ini belum dijawab.'), conn.siapakahaku[id][0])
    let src = await Func.fetchJson('https://raw.githubusercontent.com/BochilTeam/database/master/games/siapakahaku.json')
    let json = src[Math.floor(Math.random() * src.length)]
    let capt = `– *Siapakah Aku?*\n\n`
    capt += `${json.soal}\n\n`
    capt += `Timeout : ${timeout / 60 / 1000} menit\n`
    capt += `Balas pesan ini untuk menjawab, kirim ${usedPrefix}who untuk bantuan.`
    conn.siapakahaku[id] = [
      await conn.reply(m.chat, capt, m),
      json,
      poin,
      setTimeout(() => {
        if (conn.siapakahaku[id]) conn.reply(m.chat, `Waktu habis!\nJawabannya adalah *${json.jawaban}*`, conn.siapakahaku[id][0])
        delete conn.siapakahaku[id]
      }, timeout)
    ]
  } else if (command == 'who') {
    if (!(id in conn.siapakahaku)) throw false
    let clue = conn.siapakahaku[id][1].jawaban.replace(/[bcdfghjklmnpqrstvwxyz]/g, '_')
    m.reply('```' + clue + '```')
  }
}
handler.help = ['siapakahaku']
handler.tags = ['game']
handler.command = ['siapakahaku', 'who']
handler.group = handler.limit = handler.game = true
module.exports = handler