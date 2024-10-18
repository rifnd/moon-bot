module.exports = {
   help: ['checkapi'],
   tags: ['miscs'],
   command: /^(checkapi|checkkey)$/i,
   run: async (m, {
      conn,
      Func
   }) => {
      try {
         let json = await Api.get('/v1/check-key', {})
         conn.reply(m.chat, Func.jsonFormat(json), m)
      } catch (e) {
         console.log(e)
         return conn.reply(m.chat, Func.jsonFormat(e), m)
      }
   }
}