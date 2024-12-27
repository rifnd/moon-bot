let handler = (m) => m
handler.before = async function (m, {
   conn,
   users,
   groupSet
}) {
   if (!m.chat.endsWith('.net') || m.fromMe || m.key.remoteJid.endsWith('status@broadcast')) return
   if (users.banned) return
   if (m.isBot) return
   let msgs = db.msgs
   if (!(m.text in msgs)) return
   let _m = conn.serializeM(JSON.parse(JSON.stringify(msgs[m.text]), (_, v) => {
      if (v !== null && typeof v === 'object' && 'type' in v && v.type === 'Buffer' && 'data' in v && Array.isArray(v.data)) {
         return Buffer.from(v.data)
      }
      return v
   }))
   await _m.copyNForward(m.chat, true)
}
module.exports = handler