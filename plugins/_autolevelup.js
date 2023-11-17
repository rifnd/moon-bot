/*let handler = m => m
let levelling = require('../lib/levelling')
const canvacord = require('canvacord')
handler.before = async function(m) {
  let user = global.db.data.users[m.sender]
  let pp = './src/pp.png'
  let who = m.sender
  let discriminator = who.substring(9, 13)
  let users = Object.entries(global.db.data.users).map(([key, value]) => {
    return { ...value, jid: key }
  })
  let sortedLevel = users.map(toNumber('level')).sort(sort('level'))
  let usersLevel = sortedLevel.map(enumGetKey)
  let { min, xp, max } = levelling.xpRange(user.level, global.multiplier)
  try {
    pp = await this.getProfilePicture(who)
  } catch (e) {} finally {
    if (!user.autolevelup) return !0
    let before = user.level * 1
    while (levelling.canLevelUp(user.level, user.exp, global.multiplier)) user.level++

    if (before !== user.level) {
      let rank = await new canvacord.Rank()
        .setRank(usersLevel.indexOf(m.sender) + 1)
        .setAvatar(pp)
        .setLevel(user.level)
        .setCurrentXP(user.exp - min)
        .setRequiredXP(xp)
        .setProgressBar("#f2aa4c", "COLOR")
        .setUsername(this.getName(who))
        .setDiscriminator(discriminator);
      rank.build()
        .then(async data => {
          await this.sendFile(m.chat, data, ``, `_*Level Up!*_\n_${before}_ -> _${user.level}_`, m)
        })
    }
  }
}
module.exports = handler

function sort(property, ascending = true) {
  if (property) return (...args) => args[ascending & 1][property] - args[!ascending & 1][property]
  else return (...args) => args[ascending & 1] - args[!ascending & 1]
}

function toNumber(property, _default = 0) {
  if (property) return (a, i, b) => {
    return { ...b[i], [property]: a[property] === undefined ? _default : a[property] }
  }
  else return a => a === undefined ? _default : a
}

function enumGetKey(a) {
  return a.jid
}*/

let levelling = require('../lib/levelling')
module.exports = {
  before(m) {
    let user = global.db.data.users[m.sender]
    if (!user.autolevelup) return !0
    let before = user.level * 1
    while (levelling.canLevelUp(user.level, user.exp, global.multiplier)) user.level++
    if (before !== user.level) {
      m.reply(`Selamat, anda telah naik level!\n*${before}* -> *${user.level}*\ngunakan *.profile* untuk mengecek`.trim())
    }
  }
}