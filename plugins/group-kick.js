let handler = async (m, {
  teks,
  conn,
  isOwner,
  isAdmin,
  args
}) => {
  try {
    let input = text ? text : m.quoted ? m.quoted.sender : m.mentionedJid.length > 0 ? m.mentioneJid[0] : false
    if (!input) return conn.reply(m.chat, Func.texted('bold', `Mention or reply chat target.`), m)
    let p = await conn.onWhatsApp(input.trim())
    if (p.length == 0) return conn.reply(m.chat, Func.texted('bold', `Invalid number.`), m)
    let jid = conn.decodeJid(p[0].jid)
    let number = jid.replace(/@.+/, '')
    let member = participants.find(u => u.id == jid)
    if (!member) return conn.reply(m.chat, Func.texted('bold', `@${number} already left or does not exist in this group.`), m)
    conn.groupParticipantsUpdate(m.chat, [jid], 'remove').then(res => m.reply(Func.jsonFormat(res)))
  } catch (e) {
    console.log(e)
    return m.reply(Func.jsonFormat(e))
  }
}
handler.help = handler.command = ['kick']
handler.tags = ['group']
handler.group = handler.owner = handler.botAdmin = 1
module.exports = handler