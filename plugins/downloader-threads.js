let handler = async (m, {
   usedPrefix,
   command,
   args
}) => {
   if (!args[0]) return m.reply(Func.example(usedPrefix, command, 'https://www.threads.net/t/CuiXbGvPyJz/?igshid=NTc4MTIwNjQ2YQ=='))
   if (!args[0].match('threads.net')) return m.reply(status.invalid)
   let old = new Date()
   m.react('🕐')
   try {
      const json = await Func.fetchJson(API('alya', '/api/threads', {
         url: args[0]
      }, 'apikey'))
      if (!json.status) return m.reply(Func.jsonFormat(e))
      for (let i of json.data) {
         conn.sendFile(m.chat, i.url, '', `• *Fetching* : ${((new Date - old) * 1)} ms`, m)
      }
   } catch (e) {
      console.log(e)
   }
}
handler.help = handler.command = ['threads']
handler.tags = ['downloader']
handler.limit = true
module.exports = handler