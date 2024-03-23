let handler = async (m, {
  usedPrefix,
  command,
  args,
  text
}) => {
  let linkRegex = /chat.whatsapp.com\/([0-9A-Za-z]{20,24})/i
  let name = m.sender
  let [_, code] = text.match(linkRegex) || []
  if (!args[0]) return m.reply(`Enter the group link!`)
  if (!code) return m.reply(global.status.invalid)
  if (!args[1]) return m.reply(`Enter the number of days!`)
  if (isNaN(args[1])) return m.reply(`Only number format represents the number of days!`)
  m.reply(status.wait)
  await Func.delay(3000)
  try {
    var res = await conn.groupAcceptInvite(code)
    var b = await conn.groupMetadata(res)
    var d = b.participants.map(v => v.id)
    var member = d.toString()
    var e = await d.filter(v => v.endsWith(global.owner + '@s.whatsapp.net'))
    var jumlahHari = 86400000 * args[1]
    var now = new Date() * 1
    if (now < db.data.chats[res].expired) db.data.chats[res].expired += jumlahHari
    else db.data.chats[res].expired = now + jumlahHari
    if (e.length) await m.reply(`Successfully invited the bot to the group\n\n${await conn.getName(res)}\n\nThe bot will exit automatically after *${msToDate(global.db.data.chats[res].expired - now)}*`)
    conn.reply(res, `Hello everyone👋\n\nI am Moon, a whatsapp bot that is ready to help you get data, information, download media, etc. only through whatsapp\n\nBot will exit automatically after the active period expires\n*Timeout* : ${msToDate(db.data.chats[res].expired - now)}`, null, {
      mentions: [d]
    })
  } catch (e) {
    console.log(e)
    return m.reply(Func.jsonFormat(e))
  }
}
handler.help = ['join']
handler.tags = ['owner']
handler.command = ['join']
handler.owner = true
module.exports = handler
