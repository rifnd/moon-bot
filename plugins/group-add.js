let fetch = require('node-fetch')
let handler = async (m, {
  conn,
  text,
  participants,
  usedPrefix,
  command
}) => {
  try {
    let input = text ? text : m.quoted ? m.quoted.sender : m.mentionedJid.length > 0 ? m.mentioneJid[0] : false
    if (!input) return conn.reply(m.chat, Func.texted('bold', `Mention or reply chat target.`), m)
    let p = await conn.onWhatsApp(input.trim())
    if (p.length == 0) return conn.reply(m.chat, Func.texted('bold', `Invalid number.`), m)
    let jid = conn.decodeJid(p[0].jid)
    let number = jid.replace(/@.+/, '')
    let member = participants.find(u => u.id == jid)
    if (!member) return conn.reply(m.chat, Func.texted('bold', `@${number} already in this group.`), m)
    conn.groupParticipantsUpdate(m.chat, [jid], 'add').then(res => m.reply(Func.jsonFormat(res)))
  } catch (e) {
    console.log(e)
    return m.reply(Func.jsonFormat(e))
  }
}
handler.help = handler.command = ['add']
handler.tags = ['group']
handler.group = handler.admin = handler.botAdmin = handler.limit = 1
module.exports = handler