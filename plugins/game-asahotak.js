let timeout = 120000
let poin = Func.randomInt('1000', '50000')
let handler = async (m, {
  conn,
  usedPrefix,
  command
}) => {
  conn.asahotak = conn.asahotak ? conn.asahotak : {}
  let id = m.chat
  if (command == 'asahotak') {
    if (id in conn.asahotak) return conn.reply(m.chat, Func.texted('bold', '^ Soal ini belum dijawab.'), conn.asahotak[id][0])
    let src = await Func.fetchJson('https://raw.githubusercontent.com/BochilTeam/database/master/games/asahotak.json')
    let json = src[Math.floor(Math.random() * src.length)]
    let capt = `– *Asah Otak*\n\n`
    capt += `${json.soal}\n\n`
    capt += `Timeout : ${timeout / 60 / 1000} menit\n`
    capt += `Balas pesan ini untuk menjawab, kirim ${usedPrefix}ao untuk bantuan.`
    conn.asahotak[id] = [
      await conn.reply(m.chat, capt, m),
      json,
      poin,
      setTimeout(() => {
        if (conn.asahotak[id]) conn.reply(m.chat, `Waktu habis!\nJawabannya adalah *${json.jawaban}*`, conn.asahotak[id][0])
        delete conn.asahotak[id]
      }, timeout)
    ]
  } else if (command == 'ao') {
    if (!(id in conn.asahotak)) throw false
    let clue = conn.asahotak[id][1].jawaban.replace(/[bcdfghjklmnpqrstvwxyz]/g, '_')
    m.reply('```' + clue + '```')
  }
}
handler.help = ['asahotak']
handler.tags = ['game']
handler.command = ['asahotak', 'ao']
handler.limit = handler.game = handler.group = true
module.exports = handler