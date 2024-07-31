module.exports = {
   run: async (m, {
      conn,
      Func
   }) => {
      conn.reply(m.chat, Func.texted('bold', 'Total features available : ' + Object.values(global.plugins).filter((v) => v.help && v.tags).length), m)
   },
   help: ['feature'],
   tags: ['miscs'],
   command: /^(feature)$/i
}