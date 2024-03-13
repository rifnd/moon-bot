let handler = (m) => m
handler.all = async function (m, {
  conn
}) {
  if (!m.chat.endsWith('@s.whatsapp.net')) return !0
  this.confess = this.confess ? this.confess : {}
  let mf = Object.values(this.confess).find(v => v.status === false && v.penerima == m.sender)
  if (!mf) return !0
  console.log({ text: m.text })
  if (mf && (m.text === 'balas' || m.text === 'Balas' || m.text === '') && m.quoted?.mtype == 'extendedTextMessage') return m.reply(Func.texted('bold', 'Please send your reply message'))
  let txt = `You receive a reply message :\n${m.text}`
  await this.reply(mf.dari, txt, null).then(() => {
    m.reply('Successfully sent reply.')
    Func.delay(2000)
    delete this.confess[mf.id]
    return !0
  })
  return !0
}
module.exports = handler