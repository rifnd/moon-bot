module.exports = {
   run: async (m, {
      conn,
      usedPrefix,
      command,
      text,
      participants,
      Func
   }) => {
      let input = text ? text : m.quoted ? m.quoted.sender : m.mentionedJid.length > 0 ? m.mentioneJid[0] : false
      if (!input) return conn.reply(m.chat, Func.texted('bold', `🚩 Mention or reply chat target.`), m)
      let p = await conn.onWhatsApp(input.trim())
      if (p.length == 0) return conn.reply(m.chat, Func.texted('bold', `🚩 Invalid number.`), m)
      let jid = conn.decodeJid(p[0].jid)
      let number = jid.replace(/@.+/, '')
      if (command == 'kick') {
         let member = participants.find(u => u.id == jid)
         if (!member) return conn.reply(m.chat, Func.texted('bold', `🚩 @${number} already left or does not exist in this group.`), m)
         conn.groupParticipantsUpdate(m.chat, [jid], 'remove').then(res => m.reply(Func.jsonFormat(res)))
      } else if (command == 'add') {
         // if (!isOwner) return conn.reply(m.chat, global.status.owner, m)
         let member = participants.find(u => u.id == jid)
         if (member) return conn.reply(m.chat, Func.texted('bold', `🚩 @${number} already in this group.`), m)
         conn.groupParticipantsUpdate(m.chat, [jid], 'add').then(res => m.reply(Func.jsonFormat(res)))
      } else if (command == 'demote') {
         let member = participants.find(u => u.id == jid)
         if (!member) return conn.reply(m.chat, Func.texted('bold', `🚩 @${number} already left or does not exist in this group.`), m)
         conn.groupParticipantsUpdate(m.chat, [jid], 'demote').then(res => m.reply(Func.jsonFormat(res)))
      } else if (command == 'promote') {
         let member = participants.find(u => u.id == jid)
         if (!member) return conn.reply(m.chat, Func.texted('bold', `🚩 @${number} already left or does not exist in this group.`), m)
         conn.groupParticipantsUpdate(m.chat, [jid], 'promote').then(res => m.reply(Func.jsonFormat(res)))
      }
   },
   help: ['add', 'promote', 'demote', 'kick'],
   use: 'mention or reply',
   tags: ['admin'],
   command: /^(add|promote|demote|kick)$/i,
   group: true,
   admin: true,
   botAdmin: true
}