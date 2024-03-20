let handler = async (m, {
  conn,
  text
}) => {
  let teksnya = text ? text : m.quoted && m.quoted.text ? m.quoted.text : ''
  var hid = await conn.groupMetadata(m.chat)
  conn.sendMessage(m.chat, {
    text: teksnya,
    mentions: hid.participants.map((a) => a.id),
  })
}
handler.help = ['hidetag']
handler.tags = ['group']
handler.command = ['hidetag', 'h']
handler.admin = handler.group = true
module.exports = handler
