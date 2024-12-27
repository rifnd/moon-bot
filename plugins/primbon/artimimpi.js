let handler = async (m, {
   conn,
   usedPrefix,
   command,
   text,
   Func
}) => {
   try {
      if (!text) return conn.reply(m.chat, Func.example(usedPrefix, command, 'Ketiban sapi'), m)
      m.react('🕒')
      const json = await Api.get('api/artimimpi', { q: text })
      if (!json.status) return conn.reply(m.chat, Func.jsonFormat(json), m)
      m.reply(`◦ *Mimipi* : ${text}\n◦ *Arti* : ${json.data.arti}\n◦ *Solusi* : ${json.data.solusi}`)
   } catch (e) {
      return conn.reply(m.chat, Func.jsonFormat(e), m)
   }
}
handler.help = ['artimimpi']
handler.use = ['query']
handler.tags = ['primbon']
handler.limit = true
module.exports = handler