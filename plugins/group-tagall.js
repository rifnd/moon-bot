let handler = async (m, { 
  conn,
  text,
  participants
}) => {
  let users = participants.map(u => u.id).filter(v => v !== conn.user.jid)
  m.reply(`${text ? `${text}\n` : ''}Tag All\n` + users.map(v => '@' + v.replace(/@.+/, '')).join`\n` + '', null, {
    mentions: users
  })
}
handler.help = ['tagall']
handler.tags = ['group']
handler.command = ['tagall']
handler.admin = handler.group = handler.botAdmin = true
module.exports = handler