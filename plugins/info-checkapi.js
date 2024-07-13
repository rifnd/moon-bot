let handler = async (m, {
   usedPrefix,
   command,
   text
}) => {
   try {
      const json = await Func.fetchJson(API('alya', '/v1/check-key', {}, 'apikey'))
      if (!json.status) return m.reply(Func.jsonFormat(json))
      let capt = `–  *A P I K E Y*\n\n`
      capt += `  ∘  *Premium* : ${json.data.premium}\n`
      capt += `  ∘  *Limit* : ${json.data.limit}\n`
      capt += `  ∘  *Total* : ${json.data.total}\n`
      capt += `  ∘  *Expired* : ${json.data.expired_at}\n\n`
      capt += global.set.footer
      conn.reply(m.chat, capt, m)
   } catch (e) {
      console.log(e)
      return m.reply(Func.jsonFormat(e))
   }
}
handler.help = handler.command = ['checkapi']
handler.tags = ['info']
module.exports = handler