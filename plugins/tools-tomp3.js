const { toAudio, toPTT } = require('../lib/converter')

let handler = async (m, { conn, usedPrefix, command }) => {
  let q = m.quoted ? m.quoted : m
  let mime = (m.quoted ? m.quoted : m.msg).mimetype || ''
  if (/mp3|a(udio)?$/i.test(command)) {
    if (!/video|audio/.test(mime))
      throw `Reply audio/video dengan perintah *${usedPrefix + command}*`
    let media = await q.download()
    if (!media) throw 'Gagal mendownload media'
    let audio = await toAudio(media, 'mp4')
    if (!audio.data) throw 'Gagal menkonversi.'
    await conn.sendMedia(m.chat, audio.data, m, {
      fileName: Func.filename('mp3'),
      mentions: [m.sender],
    })
  }
  if (/vn|ptt$/i.test(command)) {
    if (!/video|audio/.test(mime))
      throw `Reply vn dengan perintah *${usedPrefix + command}*`
    let media = await q.download()
    if (!media) throw 'Gagal mendownload media.'
    let audio = await toPTT(media, 'mp4')
    if (!audio.data) throw 'Gagal menkonversi.'
    await conn.sendFile(m.chat, audio.data, 'vn.opus', '', m)
  }
}
handler.help = ['tomp3', 'tovn']
handler.tags = ['tools']
handler.command = /^to(mp3|a(udio)?|vn|ptt)$/i

module.exports = handler
