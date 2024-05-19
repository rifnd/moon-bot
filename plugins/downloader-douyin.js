let handler = async (m, {
  conn,
  usedPrefix,
  command,
  args
}) => {
  try {
    if (!args[0]) return m.reply(Func.example(usedPrefix, command, 'https://v.douyin.com/ikq8axJ/'))
    if (!args[0].match(/(https:\/\/v.douyin.com)/g)) return m.reply(status.invalid)
    m.react('🕐')
    let old = new Date()
    const json = await Func.fetchJson(API('alya', '/api/douyin', { url: args[0] }, 'apikey'))
    if (!json.status) return m.reply(Func.jsonFormat(json))
    json.data.map(x => {
      conn.sendFile(m.chat, x.url, '', `◦ *Fetching* : ${((new Date - old) * 1)} ms`, m)
    })
  } catch (e) {
    console.log(e)
    m.reply(Func.jsonFormat(e))
  }
}
handler.help = handler.command = ['douyin']
handler.tags = ['downloader']
handler.limit = true
module.exports = handler