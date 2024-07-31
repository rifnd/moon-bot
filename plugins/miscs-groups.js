const moment = require('moment-timezone')
moment.tz.setDefault('Asia/Jakarta').locale('id')
module.exports = {
   run: async (m, {
      conn,
      usedPrefix,
      Func
   }) => {
      try {
         let groupList = async () => Object.entries(await conn.groupFetchAllParticipating()).slice(0).map(entry => entry[1])
         let groups = await groupList()
         let rows = []
         let caption = `乂  *G R O U P - L I S T*\n\n`
         caption += `*“Bot has joined into ${groups.length} groups, send _${usedPrefix}gc_ or _${usedPrefix}gcopt_ to show all setup options.”*\n\n`
         groups.map((x, i) => {
            let v = global.db.data.groups[x.id]
            if (v) {
               caption += `›  *${(i + 1)}.* ${x.subject}\n`
               caption += `   *💳* : ${x.id.split`@`[0]}\n`
               caption += `${v.stay ? '   FOREVER' : (v.expired == 0 ? '   NOT SET' : '   ' + Func.timeReverse(v.expired - new Date() * 1))} | ${x.participants.length} | ${(v.mute ? 'OFF' : 'ON')} | ${moment(v.activity).format('DD/MM/YY HH:mm:ss')}\n\n`
            } else {
               global.db.data.groups = {
                  activity: new Date * 1,
                  isBanned: false,
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
                  autosticker: false,
                  viewonce: false,
                  filter: false,
                  member: {},
                  expired: 0,
                  stay: false
               }
            }
         })
         caption += `${global.footer}`
         m.reply(caption)
      } catch (e) {
         console.log(e)
      }
   },
   help: ['groups'],
   tags: ['miscs'],
   command: /^(groups)$/i
}