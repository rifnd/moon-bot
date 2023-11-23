const fs = require('fs')
let handler = async (m, { conn }) => {
  let setting = db.data.settings[conn.user.jid]
  const chats = Object.keys(await conn.chats)
  const groups = Object.keys(await conn.groupFetchAllParticipating())
  const block = await conn.fetchBlocklist()
  let _uptime = process.uptime() * 1000
  let uptime = clockString(_uptime)
  let cot = `乂  *S T A T U S*\n\n`
  cot += `  ∘  *${groups.length}* Grup Joined\n`
  cot += `  ∘  *${chats.length - groups.length}* Private Chats\n`
  cot += `  ∘  *${Object.keys(db.data.users).length}* User in Database\n`
  cot += `  ∘  *${block == undefined ? '0' : block.length}* User Blocked\n`
  cot += `  ∘  *${Object.entries(db.data.chats).filter((chat) => chat[1].isBanned).length}* Chats Banned\n`
  cot += `  ∘  *${Object.entries(db.data.users).filter((user) => user[1].banned).length}* Users Banned\n`
  cot += `  ∘  *Runtime* : ${uptime}\n\n`
  cot += `乂  *S Y S T E M*\n\n`
  cot += `  ∘  ${setting.anticall ? '*[ √ ]*' : '*[ × ]*'}  Anti Call\n`
  cot += `  ∘  ${setting.autoread ? '*[ √ ]*' : '*[ × ]*'}  Auto Read\n`
  cot += `  ∘  ${setting.autoreset ? '*[ √ ]*' : '*[ × ]*'}  Auto Reset\n`
  cot += `  ∘  ${setting.grouponly ? '*[ √ ]*' : '*[ × ]*'}  Group Mode\n`
  cot += `  ∘  ${setting.game ? '*[ √ ]*' : '*[ × ]*'}  Game Mode\n`
  cot += `  ∘  ${setting.rpg ? '*[ √ ]*' : '*[ × ]*'}  RPG Mode\n\n`
  cot += global.set.footer
  conn.sendMessageModify(m.chat, cot, m, {
    largeThumb: true,
  })
}
handler.help = ['status']
handler.tags = ['info']
handler.command = ['stats', 'status', 'stat', 'botstat']
module.exports = handler

function clockString(ms) {
  let h = isNaN(ms) ? '--' : Math.floor(ms / 3600000)
  let m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60
  let s = isNaN(ms) ? '--' : Math.floor(ms / 1000) % 60
  return [h, m, s].map((v) => v.toString().padStart(2, 0)).join(':')
}
