const moment = require('moment-timezone')
module.exports = {
   help: ['botstat'],
   command: ['stat', 'status'],
   tags: ['miscs'],
   run: async (m, {
      conn,
      blockList,
      Func
   }) => {
      try {
         let users = Object.entries(global.db.users)
         let chats = Object.keys(global.db.chats)
         let groups = Object.keys(global.db.groups)
         class Hit extends Array {
            total(key) {
               return this.reduce((a, b) => a + (b[key] || 0), 0)
            }
         }
         let sum = new Hit(...Object.values(global.db.stats))
         const stats = {
            users: users.length,
            chats: chats.filter(v => v.endsWith('.net')).length,
            groups: groups.filter(v => v.endsWith('g.us')).length,
            banned: users.filter(([_, v]) => v.banned).length,
            blocked: blockList.length,
            premium: users.filter(([_, v]) => v.premium).length,
            hitstat: sum.total('hitstat') != 0 ? sum.total('hitstat') : 0,
            uptime: Func.toTime(process.uptime() * 1000)
         }
         const system = global.db.setting
         conn.sendMessageModify(m.chat, statistic(Func, stats, system), m, {
            largeThumb: true,
            thumbnail: system.cover
         })
      } catch (e) {
         conn.reply(m.chat, Func.jsonFormat(e), m)
      }
   }
}

const statistic = (Func, stats, system) => {
   return `乂  *B O T S T A T*

   ◦  ${Func.texted('bold', Func.formatNumber(stats.groups))} Groups Joined
   ◦  ${Func.texted('bold', Func.formatNumber(stats.chats))} Personal Chats
   ◦  ${Func.texted('bold', Func.formatNumber(stats.users))} Users In Database
   ◦  ${Func.texted('bold', Func.formatNumber(stats.banned))} Users Banned
   ◦  ${Func.texted('bold', Func.formatNumber(stats.blocked))} Users Blocked
   ◦  ${Func.texted('bold', Func.formatNumber(stats.premium))} Premium Users
   ◦  ${Func.texted('bold', Func.formatNumber(stats.hitstat))} Commands Hit
   ◦  Runtime : ${Func.texted('bold', stats.uptime)}

乂  *S Y S T E M*

   ◦  ${Func.texted('bold', system.antispam ? '[ √ ]' : '[ × ]')}  Anti Spam
   ◦  ${Func.texted('bold', system.anticall ? '[ √ ]' : '[ × ]')}  Anti Call
   ◦  ${Func.texted('bold', system.debug ? '[ √ ]' : '[ × ]')}  Debug Mode
   ◦  ${Func.texted('bold', system.groupmode ? '[ √ ]' : '[ × ]')}  Group Mode
   ◦  ${Func.texted('bold', system.privatemode ? '[ √ ]' : '[ × ]')}  Private Mode
   ◦  ${Func.texted('bold', system.online ? '[ √ ]' : '[ × ]')}  Always Online
   ◦  ${Func.texted('bold', system.noprefix ? '[ √ ]' : '[ × ]')}  No Prefix
   ◦  ${Func.texted('bold', system.self ? '[ √ ]' : '[ × ]')}  Self Mode
   ◦  ${Func.texted('bold', system.game ? '[ √ ]' : '[ × ]')}  Game Mode
   ◦  Prefix : ${Func.texted('bold', '( ' + system.prefix.map(v => v).join(' ') + ' )')}
   ◦  Reset At : ${moment(system.lastReset).format('DD/MM/YYYY HH:mm')}

${global.footer}`
}