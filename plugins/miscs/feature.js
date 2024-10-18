module.exports = {
   help: ['feature'],
   tags: ['miscs'],
   command: /^(feature)$/i,
   run: async (m, {
      conn,
      plugins,
      Func
   }) => {
      conn.reply(m.chat, Func.texted('bold', 'Total features available : ' + Object.values(plugins).filter((v) => v.help && v.tags).length), m)
   }
}