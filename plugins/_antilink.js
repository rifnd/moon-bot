let handler = (m) => m
handler.before = async function (m, {
  user,
  isBotAdmin,
  isAdmin
}) {
  const chat = db.data.chats[m.chat]
  // antilink aktif
  if (chat.antiLink && !isAdmin && m.text) {
    if (m.text.match(/(chat.whatsapp.com)/gi) && !m.text.includes(await conn.groupInviteCode(m.chat)) || m.text.match(/(wa.me)/gi)) return conn.sendMessage(m.chat, {
      delete: {
        remoteJid: m.chat,
        fromMe: false,
        id: m.key.id,
        participant: m.sender
      }
    }).then(() => conn.groupParticipantsUpdate(m.chat, [m.sender], 'remove'))
  }
  // antilink nonaktif
  if (chat.antiLink && !isAdmin && m.text) {
    if (m.text.match(/(chat.whatsapp.com)/gi) && !m.text.includes(await conn.groupInviteCode(m.chat)) || m.text.match(/(wa.me)/gi)) return conn.sendMessage(m.chat, {
      delete: {
        remoteJid: m.chat,
        fromMe: false,
        id: m.key.id,
        participant: m.sender
      }
    })
  }
  return true
}
module.exports = handler
