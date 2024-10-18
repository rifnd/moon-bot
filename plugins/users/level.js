const { xpRange, canLevelUp } = new (require('../../lib/system/levelling'))
module.exports = {
   help: ['level'],
   tags: ['user'],
   command: /^(level)$/i,
   run: async (m, {
      conn,
      users,
      setting,
      env,
      Func
   }) => {
      try {
         var pic = 'https://telegra.ph/file/32ffb10285e5482b19d89.jpg'
         let user = Object.entries(global.db.data.users).map(([key, value]) => {
            return { ...value, jid: key }
         })
         let { xp, min, max } = xpRange(users.level, env.multiplier)
         let sortedLevel = user.map(toNumber('level')).sort(sort('level'))
         let usersLevel = sortedLevel.map(enumGetKey)
         try {
            var pic = await conn.profilePictureUrl(m.sender, 'image')
         } catch { } finally {
            let json = await Api.get('api/rank', {
               rank: usersLevel.indexOf(m.sender) + 1, level: users.level, picture: pic, currentXp: users.exp - min, requiredXp: xp, name: m.pushName
            })
            if (!canLevelUp(users.level, users.exp, env.multiplier)) {
               if (!json.status) return conn.reply(m.chat, `乂  *L E V E L*\n\nLevel : ${users.level}\nless *${max - users.exp}* Exp again`, m)
               await conn.sendFile(m.chat, json.data.url, Func.filename('jpg'), `乂  *L E V E L*\n\nLevel : ${users.level}\nless *${max - users.exp}* Exp again`, m)
            }
            let before = users.level * 1
            while (canLevelUp(users.level, users.exp, env.multiplier)) users.level++
            if (before !== user.level) {
               if (!json.status) return conn.reply(m.chat, `乂  *L E V E L - U P*\n\nFrom : [ *${before}* ] ➠ [ *${users.level}* ]\n*Congratulations!*, you have leveled up 🎉🎉🎉`, m)
               await conn.sendFile(m.chat, json.data.url, Func.filename('jpg'), `乂  *L E V E L - U P*\n\nFrom : [ *${before}* ] ➠ [ *${users.level}* ]\n*Congratulations!*, you have leveled up 🎉🎉🎉`, m)
            }
         }
      } catch (e) {
         console.log(e)
         return conn.reply(m.chat, Func.jsonFormat(e), m)
      }
   }
}

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
}