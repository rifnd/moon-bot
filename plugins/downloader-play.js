const axios = require('axios')
const yts = require('yt-search')
let handler = async (m, {
   usedPrefix,
   command,
   text
}) => {
   if (!text) return m.reply(Func.example(usedPrefix, command, 'Utopia'))
   try {
      let yt = await (await yts(text)).all
      let json = await Func.fetchJson(API('alya', '/api/yta', { url: yt[0].url }, 'apikey'))
      m.react('🕐')
      if (!json.status) return m.reply(Func.jsonFormat(json))
      let ca = `–  *Y T - P L A Y*\n\n`
      ca += `  ∘  *Title* : ` + json.title + `\n`
      ca += `  ∘  *Duration* : ` + json.duration + `\n`
      ca += `  ∘  *Viewer* : ` + json.views + `\n`
      ca += `  ∘  *Size* : ` + json.data.size + `\n\n`
      ca += global.set.footer
      let xSize = Func.sizeLimit(json.data.size, global.set.max_upload)
      if (xSize.oversize) return m.reply(`The file size (${json.data.size}) is too large, please download it yourself via this link : ${json.data.url}`)
      conn.sendMessageModify(m.chat, ca, m, {
         largeThumb: true,
         thumbnail: json.thumbnail
      }).then(async () => {
         // document
         conn.sendMedia(m.chat, json.data.url, m, {
            fileName: json.title + '.mp3',
            mimetype: 'audio/mpeg'
         })
         // audio
         /*conn.sendMessage(m.chat, { 
           audio: { url: json.data.url }, 
           fileName: json.title + '.mp3', 
           mimetype: 'audio/mpeg'
         }, { quoted: m })*/
      })
   } catch (e) {
      console.log(e)
      return m.reply(Func.jsonFormat(e))
   }
}
handler.help = handler.command = ['play']
handler.tags = ['downloader']
handler.limit = 1
module.exports = handler