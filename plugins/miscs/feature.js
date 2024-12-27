module.exports = {
   help: ['feature'],
   command: ['fitur'],
   tags: ['miscs'],
   run: async (m, {
      conn,
      plugins,
      Func
   }) => {
      let a = Func.arrayJoin(Object.values(Object.fromEntries(Object.entries(plugins).filter(([m, d]) => d.help))).map(m => m.help)).concat(Func.arrayJoin(Object.values(Object.fromEntries(Object.entries(plugins).filter(([m, d]) => d.command))).map(m => m.command))).length
      conn.reply(m.chat, Func.texted('bold', 'Total features available : [ ' + a + ' ]'), m)
   }
}