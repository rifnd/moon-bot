let handler = async (m, {
   usedPrefix,
   command,
   args
}) => {
   try {
      if (!args[0]) return m.reply(Func.example(usedPrefix, command, 'https://l.likee.video/v/MmMNz4'))
      if (!args[0].match(/(https:\/\/l.likee.video)/gi)) return m.reply(status.invalid)
      const json = await Func.fetchJson(API('alya', '/api/likee', {
         url: args[0]
      }, 'apikey'))
      if (!json.status) return m.reply(Func.jsonFormat(json))
      if (command == 'likee') {
         m.react('🕐')
         conn.sendFile(m.chat, json.data.no_watermark, '', json.data.title, m)
      } else if (command == 'likeewm') {
         m.react('🕐')
         conn.sendFile(m.chat, json.data.watermark, '', json.data.title, m)
      }
   } catch (e) {
      console.log(e)
      m.reply(Func.jsonFormat(e))
   }
}
handler.help = handler.command = ['likee', 'likeewm']
handler.tags = ['downloader']
handler.limit = true
module.exports = handler