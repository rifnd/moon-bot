const moment = require('moment-timezone')
moment.tz.setDefault(process.env.TZ)
module.exports = {
   help: ['groupinfo'],
   command: ['gcinfo', 'infogc'],
   tags: ['group'],
   run: async (m, {
      conn,
      participants,
      Func
   }) => {
      let setting = global.db.groups[m.chat]
      let meta = await (await conn.groupMetadata(m.chat))
      let admin = await conn.groupAdmin(m.chat)
      let member = participants.map(u => u.id)
      let pic = await conn.profilePictureUrl(m.chat, 'image') || await Func.fetchBuffer('./src/image/default.jpg')
      let caption = `乂  *G R O U P - I N F O*\n\n`
      caption += `   ◦  *Name* : ${meta.subject}\n`
      caption += `   ◦  *Member* : ${member.length}\n`
      caption += `   ◦  *Admin* : ${admin.length}\n`
      caption += `   ◦  *Created* : ${moment(meta.creation * 1000).format('DD/MM/YY HH:mm:ss')}\n`
      caption += `   ◦  *Owner* : ${meta.owner ? '@' + meta.owner.split('@')[0] : m.chat.match('-') ? '@' + m.chat.split('-')[0] : ''}\n\n`
      caption += `乂  *M O D E R A T I O N*\n\n`
      caption += `   ◦  ${Func.switcher(setting.antidelete, '[ √ ]', '[ × ]')} Anti Delete\n`
      caption += `   ◦  ${Func.switcher(setting.antilink, '[ √ ]', '[ × ]')} Anti Link\n`
      caption += `   ◦  ${Func.switcher(setting.antivirtex, '[ √ ]', '[ × ]')} Anti Virtex\n`
      caption += `   ◦  ${Func.switcher(setting.antisticker, '[ √ ]', '[ × ]')} Anti Sticker\n`
      caption += `   ◦  ${Func.switcher(setting.antiporn, '[ √ ]', '[ × ]')} Anti Porn\n`
      caption += `   ◦  ${Func.switcher(setting.filter, '[ √ ]', '[ × ]')} Filter\n`
      caption += `   ◦  ${Func.switcher(setting.autosticker, '[ √ ]', '[ × ]')} Auto Sticker\n`
      caption += `   ◦  ${Func.switcher(setting.detect, '[ √ ]', '[ × ]')} Detect\n`
      caption += `   ◦  ${Func.switcher(setting.viewonce, '[ √ ]', '[ × ]')} Viewonce Forwarder\n`
      caption += `   ◦  ${Func.switcher(setting.welcome, '[ √ ]', '[ × ]')} Welcome Message\n\n`
      caption += `乂  *G R O U P - S T A T U S*\n\n`
      caption += `   ◦  *Muted* : ${Func.switcher(setting.isBanned, '√', '×')}\n`
      caption += `   ◦  *Stay* : ${Func.switcher(setting.stay, '√', '×')}\n`
      caption += `   ◦  *Expired* : ${setting.expired == 0 ? 'NOT SET' : Func.timeReverse(setting.expired - new Date * 1)}\n\n`
      caption += global.footer
      conn.sendMessageModify(m.chat, caption, m, {
         largeThumb: true,
         thumbnail: pic
      })
   },
   group: true
}