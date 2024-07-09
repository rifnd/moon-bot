let handler = async (m, {
   usedPrefix,
   command,
   text
}) => {
   try {
      if (!text) return m.reply(Func.example(usedPrefix, command, 'moon-bot'))
      if (text.length > 8) return m.reply(`Text too long!`)
      m.react('🕛')
      let old = new Date()
      const json = await Func.fetchJson(API('alya', '/api/textmaker', {
         text: text, style: command.toLowerCase()
      }, 'apikey'))
      if (!json.status) return m.reply(Func.jsonFormat(json))
      conn.sendFile(m.chat, json.data.url, 'maker.jpg', `• *Processed* : ${((new Date - old) * 1)} ms`, m)
   } catch (e) {
      console.log(e)
      return m.reply(status.error)
   }
}
handler.help = handler.command = ['glitchtext', 'writetext', 'advancedglow', 'typographytext', 'pixelglitch', 'neonglitch', 'flagtext', 'flag3dtext', 'deletingtext', 'blackpinkstyle', 'glowingtext', 'underwatertext', 'logomaker', 'cartoonstyle', 'papercutstyle', 'watercolortext', 'effectclouds', 'blackpinklogo', 'gradienttext', 'summerbeach', 'luxurygold', 'multicoloredneon', 'sandsummer', 'galaxywallpaper', '1917style', 'makingneon', 'royaltext', 'freecreate', 'galaxystyle', 'lighteffects']
handler.tags = ['maker']
handler.limit = true
module.exports = handler