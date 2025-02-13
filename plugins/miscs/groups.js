const moment = require('moment-timezone')
moment.tz.setDefault(process.env.TZ).locale('id')
module.exports = {
   help: ['groups'],
   command: ['grouplist'],
   tags: ['miscs'],
   run: async (m, {
      conn,
      usedPrefix,
      Func
   }) => {
      try {
         let groups = Object.entries(await conn.groupFetchAllParticipating()).map(entry => entry[1]).filter(group => !group.isCommunity) /** exclude community */
         let caption = `乂  *G R O U P - L I S T*\n\n`
         caption += `*“Bot has joined into ${groups.length} groups, send _${usedPrefix}gc_ or _${usedPrefix}gcopt_ to show all setup options.”*\n\n`
         groups.map((x, i) => {
            let v = global.db.groups[x.id]
            if (!v) {
               global.db.groups[x.id] = {
                  activity: new Date * 1,
                  isBanned: false,
                  welcome: false,
                  sWelcome: '',
                  sBye: '',
                  detect: false,
                  sPromote: '',
                  sDemote: '',
                  antidelete: false,
                  antilink: false,
                  antivirtex: false,
                  antisticker: false,
                  autosticker: false,
                  viewonce: false,
                  filter: false,
                  member: {},
                  expired: 0,
                  stay: false
               }
               v = global.db.groups[x.id]
            }
            caption += `›  *${(i + 1)}.* ${x.subject}\n`
            caption += `   *💳* : ${x.id.split`@`[0]}\n`
            caption += `${v.stay ? '   FOREVER' : (v.expired == 0 ? '   NOT SET' : '   ' + Func.timeReverse(v.expired - new Date() * 1))} | ${x.participants.length} | ${(v.mute ? 'OFF' : 'ON')} | ${moment(v.activity).format('DD/MM/YY HH:mm:ss')}\n\n`
         })
         caption += `${global.footer}`
         m.reply(caption)
      } catch (e) {
         console.log(e)
      }
   }
}