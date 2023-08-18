const uploadFile = require('../lib/uploadFile')
const uploadImage = require('../lib/uploadImage')
let handler = async (m, {
  usedPrefix,
  command
}) => {
  let q = m.quoted ? m.quoted : m
  let mime = (q.msg || q).mimetype || ''
  if (!mime) return m.reply(Func.texted('bold', `Kirim/reply foto dengan perintah ${usedPrefix + command}`))
  m.reply(status.wait)
  let media = await q.download()
  let isTele = /image\/(png|jpe?g|gif)/.test(mime)
  let link = await (isTele ? uploadImage : uploadFile)(media)
  try {
    const json = await Func.fetchJson(API('alya', '/api/' + command.toLowerCase(), { url: link }, 'apikey'))
    if (!json.format) return m.reply(Func.jsonFormat(json))
    conn.sendFile(m.chat, json.data.url, 'Effect.jpg', `• *Process* : ${((new Date - old) * 1)} ms`, m)
  } catch (e) {
    console.log(e)
    return m.reply(status.error)
  }
}
handler.help = handler.command = ['jail', 'blur', 'invert', 'sepia', 'wasted', 'wanted', 'grayscale', '300years', 'afusion', 'approved', 'badge', 'badslap', 'beautiful', 'blurple', 'brazzers', 'burn', 'circle', 'crush', 'deepfry', 'dictator']
handler.tags = ['effect']
handler.limit = 1

module.exports = handler