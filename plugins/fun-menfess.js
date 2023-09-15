let handler = async (m, {
  conn,
  usedPrefix,
  command,
  text
}) => {
  conn.confess = conn.confess ? conn.confess : {}
  if (!text) return m.reply(Func.example(usedPrefix, command, `${m.sender.split`@`[0]} | ${conn.getName(m.sender)} | Ancok`))
  let [jid, name, pesan] = text.split('|')
  if ((!jid || !name || !pesan)) m.reply(Func.example(usedPrefix, command, `${m.sender.split`@`[0]} | ${conn.getName(m.sender)} | Ancok`))
  jid = jid.replace(/[^0-9]/g, '') + '@s.whatsapp.net'
  let data = (await conn.onWhatsApp(jid))[0] || {}
  if (!data.exists) return m.reply(Func.texted('bold', 'The number is no longer registered on WhatsApp'))
  if (jid == m.sender) return m.reply(Func.texted('bold', 'Can\'t send messages to myself'))
  let mf = Object.values(conn.confess).find(mf => mf.status === true)
  if (mf) return !0
  try {
    let id = +new Date
    let txt = `Hello @${data.jid.split('@')[0]}, You receive a confession message\n\nFrom : ${name}\nMessage : \n${pesan}\n\nWant to reply to this message? Type your message, bro, I'll pass it on to ${name}.`.trim()
    await conn.reply(data.jid, txt, null).then(() => {
      m.reply('Successfully sent the confess message.')
      conn.confess[id] = {
        id,
        dari: m.sender,
        nama: name,
        penerima: data.jid,
        pesan: pesan,
        status: false
      }
      return !0
    })
  } catch (e) {
    console.log(e)
    m.reply('eror')
  }
}
handler.help = ['menfess']
handler.tags = ['fun']
handler.command = ['menfess', 'confess', 'menfes', 'confes']
handler.private = true
module.exports = handler