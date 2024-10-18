module.exports = {
   help: ['link'],
   tags: ['group'],
   command: /^(link|getlink)$/i,
   run: async (m, {
      conn
   }) => {
      await conn.reply(m.chat, 'https://chat.whatsapp.com/' + (await conn.groupInviteCode(m.chat)), m)
   },
   group: true,
   botAdmin: true
}