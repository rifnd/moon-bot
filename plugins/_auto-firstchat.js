let handler = m => m
handler.before = async function (m) {
   if (m.chat.endsWith('broadcast')) return
   if (m.fromMe) return
   if (m.isGroup) return
   let user = global.db.data.users[m.sender]
   if (new Date - user.pc < 86400000) return // setiap 24 jam sekali
   let teks = `Hi @${m.sender.split`@`[0]}👋\n\n`
   teks += `I am a whatsapp automated system (robot)\n`
   teks += `that can help you do small jobs\n`
   teks += `such as : making stickers, download media ig tiktok youtube, playing games, etc.\n\n`
   teks += global.set.wm
   conn.sendMessageModify(m.chat, Func.Styles(teks), m, {
      largeThumb: true,
      url: db.data.settings[conn.user.jid].link
   })
   user.pc = new Date * 1
}
module.exports = handler
