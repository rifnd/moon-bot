let handler = async (m, { conn, usedPrefix, command, text }) => {
  if (!text) throw `Example : *${usedPrefix + command} 🥵+🥶*`
  m.react('⌛')
  try {
    var [emoji1, emoji2] = text.split`+`
    var rs = emoji1
    var lo = emoji2
    var ras = await fetch(`https://tenor.googleapis.com/v2/featured?key=AIzaSyAyimkuYQYF_FXVALexPuGQctUWRURdCYQ&contentfilter=high&media_filter=png_transparent&component=proactive&collection=emoji_kitchen_v5&q=${rs}_${lo}`)
    var sl = await ras.json()
    var sel = sl.results[0]
    conn.sendSticker(m.chat, sel.url, m, { packname: packname, author: author })
  } catch {
    m.reply('emoji tidak support, silahkan ganti salah satu emoji atau ubah posisi emojinya!')
  }
}
handler.help = ['emojimix']
handler.tags = ['sticker']
handler.limit = true
handler.command = ['emojimix', 'emomix']

module.exports = handler