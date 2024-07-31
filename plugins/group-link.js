module.exports = {
   run: async (m, {
      conn
   }) => {
      await conn.reply(m.chat, 'https://chat.whatsapp.com/' + (await conn.groupInviteCode(m.chat)), m)
   },
   help: ['link'],
   tags: ['group'],
   command: /^(link|getlink)$/i,
   group: true,
   botAdmin: true
}