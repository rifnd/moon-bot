let handler = m => m
handler.before = function (m, {
   isAdmin,
   isBotAdmin
}) {
   if (m.isBaileys && m.fromMe) return true
   let chat = global.db.data.chats[m.chat]
   let isSticker = m.mtype
   if (chat.antisticker && isSticker) {
      if (isSticker === 'stickerMessage') {
         if (global.opts) {
            if (isAdmin || !isBotAdmin) { } else {
               conn.sendMessage(m.chat, {
                  delete: {
                     remoteJid: m.chat,
                     fromMe: isBotAdmin ? false : true,
                     id: m.key.id,
                     participant: m.sender
                  }
               })
            }
            return true
         }
      }
   }
   return true
}
module.exports = handler