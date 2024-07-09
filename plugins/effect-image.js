let handler = async (m, {
   conn,
   usedPrefix,
   command
}) => {
   let q = m.quoted ? m.quoted : m
   let mime = (q.msg || q).mimetype || ''
   if (!/image\/(jpe?g|png)/.test(mime)) return m.reply(Func.texted('bold', `Reply or send photo use this command`))
   m.react('🕒')
   let media = await q.download()
   let anu = await scrap.uploader(media)
   try {
      const json = await Func.fetchJson(API('alya', '/api/effect', { url: anu.data.url, style: command.toLowerCase() }, 'apikey'))
      conn.sendFile(m.chat, json.data.url, '', global.set.wm, m)
   } catch (e) {
      console.log(e)
      return m.reply(Func.jsonFormat(e))
   }
}
handler.help = handler.command = ['paretro', 'retrolga', 'plumy', 'hdr', 'sepia', 'duotone', 'blackwhite', 'sketch', 'sketchril', 'oils', 'esragan', 'watercolor', 'galaxy', 'freplace', 'rainbow', 'solarize', 'pinkbir']
handler.tags = ['effect']
handler.limit = 1
module.exports = handler