let handler = async (m, {
    conn,
    usedPrefix,
    command
  }) => {
    let bot = conn.user.jid
    let q = m.quoted ? m.quoted : m
    let mime = (q.msg || q).mimetype || ''
    if (/image/.test(mime)) {
      let img = await q.download()
      if (!img) throw 'Image not found'
      await conn.updateProfile(bot, img)
      conn.reply(m.chat, 'Successfully change bot profile picture', m)
    } else return m.reply(`send/reply picture with caption *${usedPrefix + command}*`)
  }
  handler.help = ['setppbot']
  handler.tags = ['owner']
  handler.command = ['setpp', 'setppbot']
  handler.owner = true
  module.exports = handler
  