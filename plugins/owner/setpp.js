const { S_WHATSAPP_NET } = require('@whiskeysockets/baileys')
module.exports = {
   help: ['setpp'],
   use: 'reply photo',
   tags: ['owner'],
   command: /^(setpp)$/i,
   run: async (m, {
      conn,
      usedPrefix,
      command,
      Func
   }) => {
      try {
         let q = m.quoted ? m.quoted : m
         let mime = ((m.quoted ? m.quoted : m.msg).mimetype || '')
         if (/image\/(jpe?g|png)/.test(mime)) {
            m.react('🕒')
            const buffer = await q.download()
            const { img } = await Func.generateProfilePicture(buffer)
            await conn.query({
               tag: 'iq',
               attrs: {
                  to: S_WHATSAPP_NET,
                  type: 'set',
                  xmlns: 'w:profile:picture'
               },
               content: [
                  {
                     tag: 'picture',
                     attrs: {
                        type: 'image'
                     },
                     content: img
                  }
               ]
            })
            conn.reply(m.chat, Func.texted('bold', `🚩 Profile photo has been successfully changed.`), m)
         } else return conn.reply(m.chat, Func.texted('bold', `🚩 Reply to the photo that will be made into the bot's profile photo.`), m)
      } catch (e) {
         conn.reply(m.chat, Func.jsonFormat(e), m)
      }
   },
   owner: true
}