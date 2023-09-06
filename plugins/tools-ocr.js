const uploadImage = require('../lib/uploadImage')
let handler = async (m, { conn, text }) => {
  let q = m.quoted ? m.quoted : m
  let mime = (q.msg || q).mimetype || ''
  if (!mime)
    return conn.reply(
      m.chat,
      `Balas gambar yang berisi teks dengan perintah *${usedPrefix}ocr*`,
      m,
    )
  if (!/image\/(jpe?g|png)/.test(mime))
    return m.reply(Func.texted('bold', 'Media tidak didukung'))
  let img = await q.download()
  let url = await uploadImage(img)
  let hasil = await Func.fetchJson(
    API('alya', '/api/ocr', { image: url }, 'apikey'),
  )
  for (let i of hasil.data.ParsedResults) {
    m.reply(i.ParsedText)
  }
}

handler.help = ['ocr']
handler.tags = ['tools']
handler.command = ['ocr']
handler.limit = true

module.exports = handler
