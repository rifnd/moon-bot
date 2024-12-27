let handler = async (m, {
   conn,
   usedPrefix,
   command,
   text,
   Func
}) => {
   try {
      if (!text) return conn.reply(m.chat, Func.example(usedPrefix, command, 'moon'), m)
      m.react('🕒')
      const json = await Api.get('api/nomorhoki', { q: text })
      if (!json.status) return conn.reply(m.chat, Func.jsonFormat(json), m)
      m.reply(Func.jsonFormat(json.data))
   } catch (e) {
      return conn.reply(m.chat, Func.jsonFormat(e), m)
   }
}
handler.help = ['nomorhoki']
handler.use = ['62xxx']
handler.tags = ['primbon']
handler.limit = true
module.exports = handler