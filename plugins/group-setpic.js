let handler = async (m, {
   conn,
   usedPrefix,
   command
}) => {
   try {
      let q = m.quoted ? m.quoted : m
      let mime = (q.msg || q).mimetype || ''
      if (!mime) return conn.reply(m.chat, Func.texted('bold', `🚩 Reply photo.`), m)
      if (!/image\/(jpe?g|png)/.test(mime)) return conn.reply(m.chat, Func.texted('bold', `🚩 Only for photo.`), m)
      let img = await q.download()
      await conn.updateProfile(m.chat, img).then(() => m.reply(Func.texted('bold', `🚩 Success.`)))
   } catch (e) {
      console.log(e)
      return m.reply(Func.jsonFormat(e))
   }
}
handler.help = ['setpic']
handler.tags = ['group']
handler.command = ['setpic', 'setppgc']
handler.group = handler.botAdmin = handler.admin = true
module.exports = handler