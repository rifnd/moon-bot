const moment = require('moment-timezone')
moment.tz.setDefault('Asia/Jakarta')
let handler = async (m, {
  participants,
  groupMetadata
}) => {
  const getGroupAdmins = (participants) => {
    admins = []
    for (let i of participants) {
      i.isAdmin ? admins.push(i.jid) : ''
    }
    return admins
  }
  let pp = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT9mFzSckd12spppS8gAJ2KB2ER-ccZd4pBbw&usqp=CAU'
  try {
    pp = await conn.profilePictureUrl(m.chat, 'image')
  } catch (e) {
  } finally {
    const setting = db.data.chats[m.chat]
    const groupAdmins = participants.filter(p => p.admin)
    const meta = await (await conn.groupMetadata(m.chat))
    const admin = await conn.groupAdmin(m.chat)
    const listAdmin = groupAdmins.map((v, i) => `${i + 1}. @${v.id.split('@')[0]}`).join('\n')
    const owner = groupMetadata.owner || groupAdmins.find(p => p.admin === 'superadmin')?.id || m.chat.split`-`[0] + '@s.whatsapp.net'
    let now = new Date() * 1
    let text = `–  *G R O U P - I N F O*

  ∘  *ID* : ${groupMetadata.id}
  ∘  *Nama* : ${groupMetadata.subject}
  ∘  *Member* : ${participants.length}
  ∘  *Admin* : ${admin}
  ∘  *Created* : ${moment(meta.creation * 1000).format('DD/MM/YY HH:mm:ss')}
  ∘  *Owner* : @${owner.split`@`[0]}

–  *M O D E R A T I O N*

  ∘  ${Func.switcher(setting.welcome, '[ √ ]', '[ × ]')} Welcome Message
  ∘  ${Func.switcher(setting.detect, '[ √ ]', '[ × ]')} Auto Detect
  ∘  ${Func.switcher(setting.antilink, '[ √ ]', '[ × ]')} Anti link
  ∘  ${Func.switcher(setting.antisticker, '[ √ ]', '[ × ]')} Anti Sticker
  ∘  ${Func.switcher(setting.autosticker, '[ √ ]', '[ × ]')} Auto Sticker
  ∘  ${Func.switcher(setting.viewonce, '[ √ ]', '[ × ]')} Anti Viewonce
  ∘  ${Func.switcher(setting.antitoxic, '[ √ ]', '[ × ]')} Anti Toxic
  ∘  ${Func.switcher(setting.delete, '[ √ ]', '[ × ]')} Delete

–  *G R O U P - S T A T U S*

  ∘  *Expired* : ${(setting.expired - now) > 1 ? Func.toDate(setting.expired - now) : '×'}
  ∘  *Banned* : ${Func.switcher(setting.isBanned, 'True', 'False')}

${global.set.footer}`.trim()
    let ownernya = [`${m.chat.split`-`[0]}@s.whatsapp.net`]
    let mentionedJid = groupAdmins.concat(ownernya)
    conn.sendMessageModify(m.chat, text, m, {
      largeThumb: true,
      thumbnail: pp
    })
  }
}
handler.help = ['infogc']
handler.tags = ['group']
handler.command = /^(infogrup|infogc|infogroup)$/i
handler.group = true
module.exports = handler