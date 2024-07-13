let timeout = 120000
let poin = Func.randomInt('1000', '50000')
let handler = async (m, {
  conn,
  usedPrefix,
  command
}) => {
  conn.tebaklagu = conn.tebaklagu ? conn.tebaklagu : {}
  let id = m.chat
  if (command == 'tebaklagu') {
    if (id in conn.tebaklagu) conn.reply(m.chat, 'Masih ada soal belum terjawab di chat ini', conn.tebaklagu[id][0])
    let json = await Func.fetchJson(API('alya', '/api/tebaklagu', {}, 'apikey'))
    if (!json.status) return m.reply(Func.jsonFormat(json))
    let audio = await conn.sendFile(m.chat, json.data.lagu, 'audio.mp3', '', m)
    let capt = `– *Tebak Lagu*\n\n`
    capt += `Apa judul lagu ini?\n\n`
    capt += `Artis : ${json.data.artis}\n`
    capt += `Timeout : ${timeout / 60 / 1000} menit\n`
    capt += `Balas pesan ini untuk menjawab, kirim ${usedPrefix}tegu untuk bantuan`
    conn.tebaklagu[id] = [
      await conn.reply(m.chat, capt, audio),
      json,
      poin,
      setTimeout(() => {
        if (conn.tebaklagu[id]) conn.reply(m.chat, `Waktu habis!\nJawabannya adalah *${json.judul}*`, conn.tebaklagu[id][0])
        delete conn.tebaklagu[id]
      }, timeout)
    ]
  } else if (command == 'tegu') {
    if (!(id in conn.tebaklagu)) throw false
    let clue = conn.tebaklagu[id][1].data.judul.replace(/[bcdfghjklmnpqrstvwxyz]/g, '_')
    m.reply('```' + clue + '```')
  }
}
handler.help = ['tebaklagu']
handler.tags = ['game']
handler.command = ['tebaklagu', 'tegu']
handler.limit = handler.group = handler.game = true
module.exports = handler