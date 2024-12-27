module.exports = {
   help: ['runtime'],
   command: ['run', 'uptime'],
   tags: ['miscs'],
   run: async (m, {
      conn,
      Func
   }) => {
      conn.reply(m.chat, Func.texted('bold', `Running for : [ ${Func.toTime(process.uptime() * 1000)} ]`), m)
   }
}