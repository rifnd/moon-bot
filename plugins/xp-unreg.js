const { createHash } = require('crypto')
let handler = async function (m, { 
  args 
}) {
  if (!args[0]) return m.reply('Enter your serial number')
  let user = db.data.users[m.sender]
  let sn = createHash('md5').update(m.sender).digest('hex')
  if (args[0] !== sn)
  return m.reply('Wrong/invalid serial number')
  let __waktuh = new Date() - db.data.users[m.sender].unreglast
  let _waktuh = + 86400000 - __waktuh
  let waktuh = clockString(_waktuh)
  if (new Date() - db.data.users[m.sender].unreglast > +86400000) {
    user.unreglast = new Date() * 1
    user.registered = false
    m.reply('Successfully unregistered')
  } else
  m.reply(`You have unregistered, please wait ${time} again`)
}
handler.help = ['unreg']
handler.tags = ['xp']
handler.command = ['unreg', 'unregister']
handler.register = true
handler.limit = 1
module.exports = handler

function clockString(ms) {
  let h = Math.floor(ms / 3600000)
  let m = Math.floor(ms / 60000) % 60
  let s = Math.floor(ms / 1000) % 60
  console.log({ ms, h, m, s })
  return [h, m, s].map((v) => v.toString().padStart(2, 0)).join(':')
}