let handler = async (m, {
  usedPrefix,
  command,
  text,
  setting
}) => {
  let owners = setting.owners
  try {
    let input = text ? text : m.quoted ? m.quoted.sender : m.mentionedJid.length > 0 ? m.mentioneJid[0] : false
    if (!input) return conn.reply(m.chat, Func.texted('bold', `Mention or reply chat target.`), m)
    let p = await conn.onWhatsApp(input.trim())
    if (p.length == 0) return conn.reply(m.chat, Func.texted('bold', `Invalid number.`), m)
    let jid = conn.decodeJid(p[0].jid)
    let number = jid.replace(/@.+/, '')
    if (command == 'addowner') {
      if (owners.includes(number)) return conn.reply(m.chat, Func.texted('bold', `Target is already the owner.`), m)
      owners.push(number)
      conn.reply(m.chat, Func.texted('bold', `Successfully added @${number} as owner.`), m)
    } else if (command == 'delowner') {
      if (!owners.includes(number)) return conn.reply(m.chat, Func.texted('bold', `Target is not owner.`), m)
      owners.forEach((data, index) => {
        if (data === number) owners.splice(index, 1)
      })
      conn.reply(m.chat, Func.texted('bold', `Successfully removing @${number} from owner list.`), m)
    }
  } catch (e) {
    console.log(e)
    return m.reply(Func.jsonFormat(e))
  }
}
handler.help = handler.command = ['addowner', 'delowner']
handler.tags = ['owner']
handler.owner = 1
module.exports = handler