module.exports = {
  before(m) {
    let jids = [...new Set([...(m.mentionedJid || []), ...(m.quoted ? [m.quoted.sender] : [])])]
    for (let jid of jids) {
      let user = global.db.data.users[jid]
      if (!user) continue
      let afkTime = user.afk
      if (!afkTime || afkTime < 0) continue
      let reason = user.afkReason || ''
      if (!m.fromMe) {
        m.reply(`Don't tag him, he's AFK ${reason ? 'with reason ' + reason : 'no reason'} During ${Func.toTime(new Date - afkTime)}`.trim())
      }
    }
  }
}