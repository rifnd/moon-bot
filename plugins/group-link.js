let handler = async (m, {
  conn,
  args
}) => {
  await conn.reply(m.chat, 'https://chat.whatsapp.com/' + (await conn.groupInviteCode(m.chat)), m)
}
handler.help = ['link']
handler.tags = ['group']
handler.command = ['linkgc', 'link']
handler.group = 1
module.exports = handler