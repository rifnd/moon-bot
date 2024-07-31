module.exports = {
   run: async (m, {
      conn,
      usedPrefix
   }) => {
      conn.reply(m.chat, `🏷️ Upgrade to premium plan only Rp. 10,000,- to get unlimited limits for 1 month.\n\nIf you want to buy contact *${usedPrefix}owner*`, m)
   },
   help: ['premium'],
   tags: ['miscs'],
   command: /^(premium)$/i
}