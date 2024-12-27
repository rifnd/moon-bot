const { xpRange, canLevelUp } = new (require('../../../lib/system/levelling'))
module.exports = {
   async before(m, {
      conn,
      users,
      setting,
      env,
      Func
   }) {
      if (!setting.levelup || m.fromMe) return
      let user = Object.entries(global.db.users).map(([key, value]) => { return { ...value, jid: key } })
      let { xp, min, max } = xpRange(users.level, env.multiplier)
      let sortedLevel = user.map(Func.toNumber('level')).sort(Func.sort('level'))
      let usersLevel = sortedLevel.map(Func.enumGetKey)
      var pic = await conn.profilePictureUrl(m.sender, 'image') || 'https://i.ibb.co/NLJdrcJ/image.jpg'
      let before = users.level * 1
      while (canLevelUp(users.level, users.exp, env.multiplier)) {
         users.level++
      }
      let json = await Api.get('api/rank', {
         rank: usersLevel.indexOf(m.sender) + 1,
         level: users.level,
         picture: pic,
         currentXp: users.exp - min,
         requiredXp: xp,
         name: m.pushName
      })
      try {
         if (before !== users.level) {
            if (!json.status) {
               return conn.reply(m.chat, `乂  *L E V E L - U P*\n\nFrom : [ ${before} ] ➠ [ ${users.level} ]\nCongratulations you leveled up..`, m)
            }
            await conn.sendFile(m.chat, json.data.url, Func.filename('jpg'), `乂  *L E V E L - U P*\n\nFrom : [ ${before} ] ➠ [ ${users.level} ]\nCongratulations you leveled up..`, m)
         }
      } catch { }
      return true
   }
}