module.exports = {
   help: ['unbanned'],
   command: ['unban', 'unbanchat'],
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
         who = m.mentionedJid[0] ? m.mentionedJid[0] : text ? text.replace(/[^0-9]/g, '') + '@s.whatsapp.net' : m.chat
      } else {
         if (!isOwner) {
            m.reply(global.status.owner)
            throw false
         }
         who = text ? text.replace(/[^0-9]/g, '') + '@s.whatsapp.net' : m.chat
      }
      try {
         if (who.endsWith('g.us')) global.db.groups[who].isBanned = false
         else global.db.users[who].banned = false
         m.reply(`Successfully Unban, Bot active in ${await conn.getName(who) == undefined ? 'this chat' : await conn.getName(who)}.`)
      } catch (e) {
         return m.reply(Func.jsonFormat(e))
      }
   },
   owner: true
}