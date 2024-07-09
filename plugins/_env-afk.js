module.exports = {
   before(m) {
      let user = db.data.users[m.sender]
      let afk = [...new Set([...(m.mentionedJid || []), ...(m.quoted ? [m.quoted.sender] : [])])]
      for (let jid of afk) {
         let is_user = global.db.data.users[jid]
         if (!is_user) continue
         let afkTime = is_user.afk
         if (!afkTime || afkTime < 0) continue
         let reason = is_user.afkReason || ''
         if (!m.fromMe) {
            conn.reply(m.chat, `*Away From Keyboard* : @${jid.split('@')[0]}\n• *Reason* : ${reason ? reason : '-'}\n• *During* : [ ${Func.toTime(new Date - afkTime)} ]`, m)
         }
      }
   }
}