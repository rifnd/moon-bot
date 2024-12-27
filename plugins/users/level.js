const { xpRange, canLevelUp } = new (require('../../lib/system/levelling'))
module.exports = {
   help: ['level'],
   tags: ['user'],
   run: async (m, {
      conn,
      users,
      env,
      Func
   }) => {
      let user = Object.entries(global.db.users).map(([key, value]) => {
         return { ...value, jid: key }
      })
      let { xp, min, max } = xpRange(users.level, env.multiplier)
      let sortedLevel = user.map(Func.toNumber('level')).sort(Func.sort('level'))
      let usersLevel = sortedLevel.map(Func.enumGetKey)
      let pic = await conn.profilePictureUrl(m.sender, 'image') || 'https://i.ibb.co/NLJdrcJ/image.jpg'
      let json = await Api.get('api/rank', {
         rank: usersLevel.indexOf(m.sender) + 1,
         level: users.level,
         picture: pic,
         currentXp: users.exp - min,
         requiredXp: xp,
         name: m.pushName
      })
      if (!canLevelUp(users.level, users.exp, env.multiplier)) {
         if (!json.status) {
            return conn.reply(m.chat, `Level : ${users.level}\nExp : ${Func.formatNumber(users.exp)} / ${Func.formatNumber(max)}\n\nLess *${Func.formatNumber(max - users.exp)}* EXP to level up.`, m)
         }
         return await conn.sendFile(m.chat, json.data.url, Func.filename('jpg'), `Level : ${users.level}\nExp :  ${Func.formatNumber(users.exp)} / ${Func.formatNumber(max)}\n\nLess *${Func.formatNumber(max - users.exp)}* EXP to level up.`, m)
      }
      let before = users.level
      while (canLevelUp(users.level, users.exp, env.multiplier)) {
         users.level++
      }
      if (before !== users.level) {
         if (!json.status) {
            return conn.reply(m.chat, `乂  *L E V E L - U P*\n\nFrom : [ ${before} ] ➠ [ ${users.level} ]\nCongratulations you leveled up..`, m)
         }
         return await conn.sendFile(m.chat, json.data.url, Func.filename('jpg'), `乂  *L E V E L - U P*\n\nFrom : [ ${before} ] ➠ [ ${users.level} ]\nCongratulations you leveled up..`, m)
      }
   }
}