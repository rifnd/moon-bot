const { createHash } = require('crypto')
let Reg = /\|?(.*)([.|] *?)([0-9]*)$/i
module.exports = {
   help: ['unreg'],
   use: 'sn',
   tags: ['user'],
   command: /^(unreg)$/i,
   run: async (m, {
      conn,
      usedPrefix,
      text,
      users,
      Func
   }) => {
      let _timeSn = 86400000
      let timeSn = new Date(users.snlast + _timeSn)
      let timeout = timeSn - new Date()
      if (new Date - users.snlast > _timeSn) {
         users.snlast = new Date() * 1
         let sn = createHash('md5').update(m.sender).digest('hex')
         m.reply(`${usedPrefix}unreg ${sn}`)
      } else {
         conn.reply(m.chat, `*You have already unregistered, You can unregistered in the next day.*\n\nTimeout : [ ${Func.toTime(timeout)} ]`, m)
      }
   },
   limit: true
}