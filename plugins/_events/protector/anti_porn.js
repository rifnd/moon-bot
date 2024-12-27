let handler = (m) => m
handler.before = async function (m, {
   conn,
   body,
   isAdmin,
   isBotAdmin,
   groupSet,
   Scraper,
   Func
}) {
   try {
      if (!m.fromMe && m.isGroup && groupSet.antiporn && /image/.test(m.mtype) && !isAdmin && isBotAdmin) {
         let media = await Scraper.uploader(await m.download())
         let json = await Api.get('api/detect-porn', { image: media.data.url })
         if (!json.status) return console.error(json)
         if (json.data.isPorn) return m.reply(Func.jsonFormat(json)).then(() => conn.groupParticipantsUpdate(m.chat, [m.sender], 'remove'))
      } else if (!m.fromMe && !m.isGroup && /image/.test(m.mtype)) {
         let media = await Scraper.uploader(await m.download())
         let json = await Api.get('api/detect-porn', { image: media.data.url })
         if (!json.status) return console.error(json)
         if (json.data.isPorn) return m.reply(Func.jsonFormat(json)).then(() => conn.updateBlockStatus(m.sender, 'block'))
      }
   } catch (e) {
      console.log(e)
   }
   return true
}
module.exports = handler