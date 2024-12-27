const { createHash } = require('crypto')
let handler = async (m, {
   conn,
   text,
   users,
   Func
}) => {
   if (!text) return conn.reply(m.chat, 'Enter your serial number', m)
   let sn = createHash('md5').update(m.sender).digest('hex')
   if (text !== sn) return conn.reply(m.chat, 'Wrong / invalid serial number', m)
   let timeReg = 1296000000
   let unregs = new Date(users.unreglast + timeReg)
   let timeout = unregs - new Date()
   if (new Date - users.unreglast > timeReg) {
      users.unreglast = new Date() * 1
      users.registered = false
      m.reply('Successfully unregistered')
   } else {
      conn.reply(m.chat, `You have already canceled your registration, you can do it again within the next 15 days.\n\nTimeout : [ ${Func.toTime(timeout)} ]`, m)
   }
}
handler.help = ['unreg']
handler.tags = ['user']
handler.register = true
handler.limit = 1
module.exports = handler