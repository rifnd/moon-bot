const axios = require('axios')
let handler = async (m, {
   conn,
   usedPrefix,
   command,
   text
}) => {
   try {
      if (!text) return m.reply(Func.example(usedPrefix, command, 'girl | black | Cartoon | 1:1'))
      let [prompt, negative_prompt, model, ratio] = text.split` | `
      m.react('🕒')
      const json = (await axios.post(API('alya', '/api/text2img'), {
         prompt, negative_prompt, model, ratio, apikey: API('alya', '/', {}, 'apikey').split('=')[1]
      })).data
      if (!json.status) return m.reply(Func.jsonFormat(json))
      await conn.sendFile(m.chat, json.data.images[0].url, Func.filename('jpg'), json.data.negative_prompt, m)
   } catch (e) {
      console.log(e)
      return m.reply(Func.jsonFormat(e))
   }
}
handler.help = ['text2img']
handler.tags = ['tools']
handler.command = /^(text2img)$/i
handler.premium = true
module.exports = handler