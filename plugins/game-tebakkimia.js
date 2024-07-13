let timeout = 120000
let poin = Func.randomInt('1000', '50000')
let handler = async (m, {
  conn,
  usedPrefix,
  command
}) => {
  conn.tebakkimia = conn.tebakkimia ? conn.tebakkimia : {}
  let id = m.chat
  if (command == 'tebakkimia') {
    if (id in conn.tebakkimia) return conn.reply(m.chat, 'Masih ada soal belum terjawab di chat ini', conn.tebakkimia[id][0])
    let src = await Func.fetchJson('https://raw.githubusercontent.com/BochilTeam/database/master/games/tebakkimia.json')
    let json = src[Math.floor(Math.random() * src.length)]
    let capt = `– *Tebak Kimia*\n\n`
    capt += `Nama unsur dari lambang ${json.lambang} adalah...\n\n`
    capt += `Timeout : ${timeout / 60 / 1000} menit\n`
    capt += `Balas pesan ini untuk menjawab, kirim ${usedPrefix}teki untuk bantuan`
    conn.tebakkimia[id] = [
      await conn.reply(m.chat, caption, m),
      json,
      poin,
      setTimeout(() => {
        if (conn.tebakkimia[id]) conn.reply(m.chat, `Waktu habis!\nJawabannya adalah *${json.unsur}*`, conn.tebakkimia[id][0])
        delete conn.tebakkimia[id]
      }, timeout)
    ]
  } else if (command == 'teki') {
    if (!(id in conn.tebakkimia)) throw false
    let json = conn.tebakkimia[id][1]
    m.reply('```' + json.unsur.replace(/[bcdfghjklmnpqrstvwxyz]/g, '_') + '```')
  }
}
handler.help = ['tebakkimia']
handler.tags = ['game']
handler.command = ['tebakkimia', 'teki']
handler.limit = handler.group = handler.game = true
module.exports = handler