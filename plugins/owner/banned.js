module.exports = {
   help: ['banned'],
   command: ['ban', 'banchat'],
   use: 'mention or reply',
   tags: ['owner'],
   run: async (m, {
      conn,
      isOwner,
      text,
      isAdmin,
      Func
   }) => {
      let who
      if (m.isGroup) {
         if (!(isAdmin || isOwner)) {
            m.reply(global.status.admin)
            throw false
         }
         if (isOwner) who = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : text ? text.replace(/[^0-9]/g, '') + '@s.whatsapp.net' : m.chat
         else who = m.chat
      } else {
         if (!isOwner) {
            m.reply(global.status.owner)
            throw false
         }
         who = text ? text.replace(/[^0-9]/g, '') + '@s.whatsapp.net' : m.chat
      }

      try {
         if (who.endsWith('g.us')) global.db.groups[who].isBanned = true
         else global.db.users[who].banned = true
         conn.reply(m.chat, `Successfully banned! ${await conn.user.name} inactive on chat ${await conn.getName(who) == undefined ? 'this' : await conn.getName(who)}.`, m)
      } catch (e) {
         console.log(e)
         return m.reply(Func.jsonFormat(e))
      }
   },
   owner: true
}