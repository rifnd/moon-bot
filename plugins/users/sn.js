const { createHash } = require('crypto')
module.exports = {
   help: ['sn'],
   tags: ['user'],
   run: async (m, {
      conn,
      usedPrefix,
      text,
      users,
      Func
   }) => {
      let sn = createHash('md5').update(m.sender).digest('hex')
      m.reply(`${usedPrefix}unreg ${sn}`)
   },
   limit: true,
   register: true
}