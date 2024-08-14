const moment = require('moment-timezone')
moment.tz.setDefault('Asia/Jakarta')
module.exports = {
   run: async (m, {
      conn,
      participants,
      Func
   }) => {
      try {
         let setting = global.db.data.groups[m.chat]
         var pic = './src/image/default.png'
         let meta = await (await conn.groupMetadata(m.chat))
         let admin = await conn.groupAdmin(m.chat)
         let member = participants.map(u => u.id)
         try {
            var pic = await Func.fetchBuffer(await conn.profilePictureUrl(m.chat, 'image'))
         } catch { } finally {
            let caption = `乂  *G R O U P - I N F O*\n\n`
            caption += `	◦  *Name* : ${meta.subject}\n`
            caption += `	◦  *Member* : ${member.length}\n`
            caption += `	◦  *Admin* : ${admin.length}\n`
            caption += `	◦  *Created* : ${moment(meta.creation * 1000).format('DD/MM/YY HH:mm:ss')}\n`
            caption += `	◦  *Owner* : ${meta.owner ? '@' + meta.owner.split('@')[0] : m.chat.match('-') ? '@' + m.chat.split('-')[0] : ''}\n\n`
            caption += `乂  *M O D E R A T I O N*\n\n`
            caption += `	◦  ${Func.switcher(setting.antidelete, '[ √ ]', '[ × ]')} Anti Delete\n`
            caption += `	◦  ${Func.switcher(setting.antilink, '[ √ ]', '[ × ]')} Anti Link\n`
            caption += `	◦  ${Func.switcher(setting.antivirtex, '[ √ ]', '[ × ]')} Anti Virtex\n`
            caption += `	◦  ${Func.switcher(setting.antisticker, '[ √ ]', '[ × ]')} Anti Sticker\n`
            caption += `	◦  ${Func.switcher(setting.filter, '[ √ ]', '[ × ]')} Filter\n`
            caption += `	◦  ${Func.switcher(setting.autosticker, '[ √ ]', '[ × ]')} Auto Sticker\n`
            caption += `	◦  ${Func.switcher(setting.detect, '[ √ ]', '[ × ]')} Detect\n`
            caption += `	◦  ${Func.switcher(setting.viewonce, '[ √ ]', '[ × ]')} Viewonce Forwarder\n`
            caption += `	◦  ${Func.switcher(setting.welcome, '[ √ ]', '[ × ]')} Welcome Message\n\n`
            caption += `乂  *G R O U P - S T A T U S*\n\n`
            caption += `	◦  *Muted* : ${Func.switcher(setting.isBanned, '√', '×')}\n`
            caption += `	◦  *Stay* : ${Func.switcher(setting.stay, '√', '×')}\n`
            caption += `	◦  *Expired* : ${setting.expired == 0 ? 'NOT SET' : Func.timeReverse(setting.expired - new Date * 1)}\n\n`
            caption += global.footer
            conn.sendMessageModify(m.chat, caption, m, {
               largeThumb: true,
               thumbnail: pic,
            })
         }
      } catch (e) {
         console.log(e)
         conn.reply(m.chat, Func.jsonFormat(e), m)
      }
   },
   help: ['groupinfo'],
   tags: ['group'],
   command: /^(groupinfo|gcinfo)$/i
}