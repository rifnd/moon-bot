let handler = async (m, {
    conn,
    usedPrefix,
    command
  }) => {
    let q = m.quoted ? m.quoted : m
    let mime = (q.msg || q).mimetype || ''
    if (/image/.test(mime)) {
      let img = await q.download()
      if (!img) throw 'Gambar tidak ditemukan'
      await conn.updateProfilePicture(m.chat, img)
    } else return m.reply(`kirim/balas gambar dengan caption *${usedPrefix + command}*`)
  }
  handler.help = ['setpic']
  handler.tags = ['group']
  handler.command = /^set(pic|ppgc)?$/i
  handler.group = true
  handler.admin = true
  handler.botAdmin = true
  
  module.exports = handler
  