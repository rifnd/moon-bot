module.exports = {
   help: ['checkapi'],
   tags: ['miscs'],
   command: /^(checkapi|checkkey|apikey)$/i,
   run: async (m, {
      conn,
      Func
   }) => {
      try {
         let json = await Api.get('/v1/check-key', {})
         if (!json.status) return m.reply(Func.jsonFormat(json))
         let caption = '乂  *A P I K E Y*\n\n'
         caption += `   ◦  *Limit* : (${json.data.limit} / ${json.data.total})\n`
         caption += `   ◦  *Premium* : ${json.data.premium ? '√' : '×'}\n`
         caption += `   ◦  *Expired* : ${json.data.expired_at}\n`
         caption += `   ◦  *Joinded* : ${json.data.joined_at}\n\n`
         caption += global.footer
         conn.reply(m.chat, caption, m)
      } catch (e) {
         console.log(e)
         return conn.reply(m.chat, Func.jsonFormat(e), m)
      }
   }
}