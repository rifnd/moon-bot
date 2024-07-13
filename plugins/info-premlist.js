let handler = async (m, {
   conn,
   text
}) => {
   let users = global.db.data.users
   let { registered, name } = global.db.data.users[m.sender]
   var text = ''
   var i = 1
   for (let jid in users) {
      if (users[jid].premium) {
         text += `\n${i}. @${jid.replace(/@.+/, '')}\n    ${Func.toDate(global.db.data.users[jid].premiumDate - new Date() * 1)}\n`
         i += 1
      }
   }
   return conn.reply(m.chat, `Total *"${i - 1}"* User${text}`, m, {
      contextInfo: {
         mentionedJid: conn.parseMention(text)
      }
   })
}
handler.help = handler.command = ['premlist']
handler.tags = ['info']
handler.limit = true
module.exports = handler