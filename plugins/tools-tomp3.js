const { toAudio, toPTT } = require('../lib/converter')
let handler = async (m, { 
  conn,
  usedPrefix,
  command
}) => {
  let q = m.quoted ? m.quoted : m
  let mime = (m.quoted ? m.quoted : m.msg).mimetype || ''
  if (/mp3|a(udio)?$/i.test(command)) {
    if (!/video|audio/.test(mime)) return m.reply(`Audio/video only`)
    let media = await q.download()
    let audio = await toAudio(media, 'mp4')
    if (!audio.data) return m.reply(`Failure to convert`)
    await conn.sendMedia(m.chat, audio.data, m, {
      fileName: Func.filename('mp3'),
      mentions: [m.sender],
    })
  }
  if (/vn|ptt$/i.test(command)) {
    if (!/video|audio/.test(mime)) return m.reply(`Audio/video only`)
    let media = await q.download()
    let audio = await toPTT(media, 'mp4')
    if (!audio.data) return m.reply(`Failure to convert`)
    await conn.sendFile(m.chat, audio.data, 'vn.opus', '', m)
  }
}
handler.help = ['tomp3', 'tovn']
handler.tags = ['tools']
handler.command = ['tomp3', 'toaudio', 'tovn', 'toppt']
handler.limit = true
module.exports = handler
