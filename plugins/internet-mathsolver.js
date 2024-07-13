let handler = async (m, {
   conn,
   usedPrefix,
   command,
   text
}) => {
   try {
      if (!text) return m.reply(Func.example(usedPrefix, command, '1 ditambah 1'))
      m.react('🕒')
      const json = await Func.fetchJson(API('alya', '/api/ai-mathsolver', {
         q: text
      }, 'apikey'))
      if (!json.status) return m.reply(Func.jsonFormat(json))
      m.reply(json.data.answer)
   } catch (e) {
      console.log(e)
      return m.reply(Func.jsonFormat(e))
   }
}
handler.help = handler.command = ['mathsolver']
handler.tags = ['internet']
handler.limit = true
module.exports = handler