let handler = async (m, {
   usedPrefix,
   command,
   text
}) => {
   try {
      if (!text) return m.reply(Func.example(usedPrefix, command, 'How to create delay function | js'))
      let [code, act] = text.split` | `
      m.react('🕒')
      const json = await Func.fetchJson(API('alya', '/api/ai-code', { text: text, action: act }, 'apikey'))
      if (!json.status) return m.reply(Func.jsonFormat(json))
      m.reply(json.data.code)
   } catch (e) {
      console.log(e)
      return m.reply(Func.jsonFormat(e))
   }
}
handler.help = handler.command = ['ai-code']
handler.tags = ['internet']
handler.limit = true
module.exports = handler