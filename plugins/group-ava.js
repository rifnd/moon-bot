module.exports = {
   run: async (m, {
      conn,
      text,
      Func
   }) => {
      let number = isNaN(text) ? (text.startsWith('+') ? text.replace(/[()+\s-]/g, '') : (text).split`@`[1]) : text
      if (!text && !m.quoted) return conn.reply(m.chat, Func.texted('bold', `🚩 Mention or reply chat target.`), m)
      if (isNaN(number)) return conn.reply(m.chat, Func.texted('bold', `🚩 Invalid number.`), m)
      if (number.length > 15) return conn.reply(m.chat, Func.texted('bold', `🚩 Invalid format.`), m)
      try {
         if (text) {
            var user = number + '@s.whatsapp.net'
         } else if (m.quoted.sender) {
            var user = m.quoted.sender
         } else if (m.mentionedJid) {
            var user = number + '@s.whatsapp.net'
         }
      } catch (e) { } finally {
         var pic = false
         try {
            var pic = await conn.profilePictureUrl(user, 'image')
         } catch { } finally {
            if (!pic) return conn.reply(m.chat, Func.texted('bold', `🚩 He/She didn't put a profile picture.`), m)
            conn.sendFile(m.chat, pic, '', '', m)
         }
      }
   },
   help: ['ava'],
   use: 'mention or reply',
   tags: ['group'],
   command: /^(ava)$/i
}