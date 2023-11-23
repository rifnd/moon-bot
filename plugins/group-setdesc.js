let handler = async (m, {
  conn,
  args
}) => {
  await conn.groupUpdateDescription(m.chat, `${args.join(" ")}`)
  m.reply('Successfully change the group description')
}
handler.help = handler.command = ['setdesc']
handler.tags = ['group']
handler.group = handler.admin = handler.botAdmin = true
module.exports = handler