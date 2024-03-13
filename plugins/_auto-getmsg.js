let handler = m => m
handler.before = async function (m, {
  setting,
  chat,
  users
}) {
  if (m.chat.endsWith('broadcast') || chat.isBanned || users.banned || m.isBaileys) return
  let msgs = db.data.msgs
  if (!(m.text in msgs)) return
  let _m = this.serializeM(JSON.parse(JSON.stringify(msgs[m.text]), (_, v) => {
    if (v !== null && typeof v === 'object' && 'type' in v && v.type === 'Buffer' && 'data' in v && Array.isArray(v.data)) {
      return Buffer.from(v.data)
    }
    return v
  }))
  await _m.copyNForward(m.chat, true)
}
module.exports = handler