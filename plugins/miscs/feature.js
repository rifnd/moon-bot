module.exports = {
   help: ['feature'],
   tags: ['miscs'],
   command: /^(feature)$/i,
   run: async (m, {
      conn,
      plugins,
      Func
   }) => {
      const totalHelpItems = Object.values(plugins).filter((v) => v.help).reduce((sum, v) => sum + (Array.isArray(v.help) ? v.help.length : 0), 0)
      conn.reply(m.chat, Func.texted('bold', 'Total features available : [ ' + totalHelpItems + ' ]'), m)
   }
}