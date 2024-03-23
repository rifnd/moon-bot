let handler = async (m, {
  usedPrefix,
  command,
  text
}) => {
  try {
    let input = text ? text : m.quoted ? m.quoted.sender : m.mentionedJid.length > 0 ? m.mentioneJid[0] : false
    if (!input) return m.reply(`Enter the target number or tag!`)
    let p = await conn.onWhatsApp(input.trim())
    if (p.length == 0) return m.reply(Func.texted('bold', `Invalid number.`))
    let jid = conn.decodeJid(p[0].jid)
    conn.updateBlockStatus(jid, 'unblock').then(res => m.reply(Func.jsonFormat(res)))
    m.reply(`Berhasil`)
  } catch (e) {
    console.log(e)
    return m.reply(Func.jsonFormat(e))
  }
}
handler.help = handler.command = ['unblock']
handler.tags = ['owner']
handler.owner = true
module.exports = handler