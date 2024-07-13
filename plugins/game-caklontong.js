let timeout = 180000
let poin = Func.randomInt('1000', '50000')
let handler = async (m, {
  conn,
  usedPrefix,
  command
}) => {
  conn.caklontong = conn.caklontong ? conn.caklontong : {}
  let id = m.chat
  if (command == 'caklontong') {
    if (id in conn.caklontong) return conn.reply(m.chat, Func.texted('bold', '^ Soal ini belum dijawab.'), conn.caklontong[id][0])
    let src = await Func.fetchJson('https://raw.githubusercontent.com/BochilTeam/database/master/games/caklontong.json')
    let json = src[Math.floor(Math.random() * src.length)]
    let capt = `– *Cak Lontong*\n\n`
    capt += `${json.soal}\n\n`
    capt += `Timeout : ${timeout / 60 / 1000} menit\n`
    capt += `Balas pesan ini untuk menjawab, kirim ${usedPrefix}calo untuk bantuan.`
    conn.caklontong[id] = [
      await conn.reply(m.chat, capt, m),
      json,
      poin,
      setTimeout(() => {
        if (conn.caklontong[id]) conn.reply(m.chat, `Waktu habis!\nJawabannya adalah *${json.jawaban}*\n${json.deskripsi}`, conn.caklontong[id][0])
        delete conn.caklontong[id]
      }, timeout)
    ]
  } else if (command == 'calo') {
    if (!(id in conn.caklontong)) throw false
    let json = conn.caklontong[id][1]
    let ans = json.jawaban
    let clue = ans.replace(/[bcdfghjklmnpqrstvwxyz]/g, '_')
    m.reply('```' + clue + '```')
  }
}
handler.help = ['caklontong']
handler.tags = ['game']
handler.command = ['caklontong', 'calo']
handler.limit = handler.group = handler.game = true
module.exports = handler