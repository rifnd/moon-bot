let handler = async(m, {
  usedPrefix,
  command,
  args
}) => {
  try {
    if (!args[0]) return m.reply(Func.example(usedPrefix, command, 'https://api.alyachan.pro'))
    if (!/^https?:\/\//.test(args[0])) return m.reply('Prefix links with https://')
    switch (command) {
      case 'ss':
      case 'screenshot': {
        m.react('🕒')
        const json = await Func.fetchJson(API('alya', '/api/sshp', { url: args[0] }, 'apikey'))
        if (!json.status) return m.reply(Func.jsonFormat(json))
        conn.sendFile(m.chat, json.data.url, '', global.set.wm, m)
      }
      break
      case 'ssweb': {
        m.react('🕒')
        const json = await Func.fetchJson(API('alya', '/api/ssweb', { url: args[0] }, 'apikey'))
        if (!json.status) return m.reply(Func.jsonFormat(json))
        conn.sendFile(m.chat, json.data.url, '', global.set.wm, m)
      }
      break
    }
  } catch (e) {
    m.reply(Func.jsonFormat(e))
  }
}
handler.help = handler.command = ['screenshot', 'ss', 'ssweb']
handler.tags = ['tool']
handler.limit = true
module.exports = handler