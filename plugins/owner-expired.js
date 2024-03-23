let handler = async (m, {
  conn,
  args,
  usedPrefix,
  command
}) => {
  if (!args[0] || isNaN(args[0])) return m.reply(Func.example(usedPrefix, command, '30'))
  let who
  if (m.isGroup) who = args[1] ? args[1] : m.chat
  else who = args[1]
  var jumlahHari = 86400000 * args[0]
  var now = new Date() * 1
  if (now < global.db.data.chats[who].expired)
    global.db.data.chats[who].expired += jumlahHari
  else global.db.data.chats[who].expired = now + jumlahHari
  conn.reply(m.chat, `successfully set the expiration date for ${await conn.getName(who)} for ${args[0]} days\n\nCountdown : ${Func.toDate(global.db.data.chats[who].expired - now)}`, m)
}
handler.help = handler.command = ['expired']
handler.tags = ['owner']
handler.owner = true
module.exports = handler
