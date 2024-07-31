module.exports = {
   run: async (m, {
      conn,
      Func
   }) => {
      conn.reply(m.chat, Func.texted('bold', `Ping : ${Number(performance.now() - performance.now()).toFixed(2)} Milisecond`), m)
   },
   help: ['ping'],
   tags: ['miscs'],
   command: /^(ping)$/i,
}