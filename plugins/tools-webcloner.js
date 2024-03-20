let handler = async (m, {
  conn,
  usedPrefix,
  command,
  args
}) => {
  try {
    if (!args[0]) return m.reply(Func.example(usedPrefix, command, 'https://google.com'))
    if (!/^https?:\/\//.test(args[0])) return m.reply('Prefix the link with https://')
    m.react('🕒')
    const json = await Func.fetchJson(API('alya', '/api/web-cloner', { url: args[0] }, 'apikey'))
    if (!json.status) return m.reply(Func.jsonFormat(e))
    conn.sendMessage(m.chat, {
      document: {
        url: json.data.url
      },
      mimetype: 'application/x-zip',
      fileName: args[0] + '.zip'
    }, { quoted: m })
  } catch (e) {
    console.log(e)
    return m.reply(Func.jsonFormat(e))
  }
}
handler.help = ['cloneweb']
handler.tags = ['tools']
handler.command = ['cloneweb']
handler.limit = true
module.exports = handler