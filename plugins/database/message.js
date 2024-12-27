const { proto } = require('@whiskeysockets/baileys')
let handler = async (m, {
   conn,
   command,
   usedPrefix,
   text,
   Func
}) => {
   if (command == '+msg') {
      let M = proto.WebMessageInfo
      if (!m.quoted) return conn.reply(m.chat, Func.texted('bold', '🚩 Reply message using commands'), m)
      if (!text) return conn.reply(m.chat, Func.example(usedPrefix, command, 'halo'), m)
      let msgs = db.msgs
      if (text in msgs) return conn.reply(m.chat, `*"${text}"* already exists in the database`, m)
      msgs[text] = M.fromObject(await m.getQuotedObj()).toJSON()
      conn.reply(m.chat, `${Func.texted('bold', `🚩 Message successfully saved in the database`)} : ${Func.texted('monospace', text)}`, m)
   } else if (command == '-msg') {
      if (!text) return conn.reply(m.chat, `Use *${usedPrefix}listmsg* to view the msg list.`, m)
      let msgs = db.data.msgs
      if (!(text in msgs)) return conn.reply(m.chat, `*"${text}"* does not exist in the database.`, m)
      delete msgs[text]
      conn.reply(m.chat, Func.texted('bold', `🚩 Message successfully deleted from the database`), m)
   } else if (command == 'msglist') {
      let msgs = db.msgs
      let split = Object.entries(msgs).map(([nama, isi]) => { return { nama, ...isi } })
      let fltr = split.map(v => '   ◦  ' + v.nama).join('\n')
      conn.reply(m.chat, `${fltr}`.trim(), m)
   }
}
handler.help = ['+msg', '-msg', 'msglist']
handler.tags = ['database']
handler.limit = true
module.exports = handler