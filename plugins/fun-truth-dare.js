let handler = async (m, {
  conn,
  command
}) => {
  if (command == 'truth') {
    const src = await Func.fetchJson('https://raw.githubusercontent.com/NzrlAfndi/Databasee/main/text/dare.json')
    let json = src[Math.floor(Math.random() * src.length)]
    m.reply(json)
  }
  if (command == 'dare') {
    const src = await Func.fetchJson('https://raw.githubusercontent.com/NzrlAfndi/Databasee/main/text/truth.json')
    let json = src[Math.floor(Math.random() * src.length)]
    m.reply(json)
  }
}
handler.help = ['truth', 'dare']
handler.tags = ['fun']
handler.command = /^(truth|dare)$/i
handler.limit = true
module.exports = handler