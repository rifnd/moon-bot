let handler = (m) => m
handler.before = async function (m, {
   conn,
   prefixes,
   body,
   env,
   users,
   Func
}) {
   let id = m.chat, poin = Func.randomInt(env.min_reward, env.max_reward)
   conn.guesspic = conn.guesspic ? conn.guesspic : {}
   if (m.quoted && /picclue/i.test(m.quoted.text)) {
      if (!(id in conn.guesspic) && /picclue/i.test(m.quoted.text)) return m.reply('Soal itu telah berakhir')
      if (m.quoted.id == conn.guesspic[id][0].key.id) {
         if (['Timeout', ''].includes(body)) return !0
         let json = JSON.parse(JSON.stringify(conn.guesspic[id][1]))
         if (body.toLowerCase() == json.jawaban.toLowerCase().trim()) {
            await m.reply(`Benar, *+${Func.formatNumber(conn.guesspic[id][2])}* EXP`).then(() => {
               users.exp += poin
               clearTimeout(conn.guesspic[id][3])
               delete conn.guesspic[id]
            })
         } else m.reply('Salah!')
      }
   }
   return true
}
module.exports = handler