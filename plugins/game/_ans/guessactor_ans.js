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
   conn.guessactor = conn.guessactor ? conn.guessactor : {}
   if (m.quoted && /actorclue/i.test(m.quoted.text)) {
      if (!(id in conn.guessactor) && /actorclue/i.test(m.quoted.text)) return m.reply('Soal itu telah berakhir')
      if (m.quoted.id == conn.guessactor[id][0].key.id) {
         if (['Timeout', ''].includes(body)) return !0
         let json = JSON.parse(JSON.stringify(conn.guessactor[id][1]))
         if (body.toLowerCase() == json.data.title.toLowerCase().trim()) {
            await m.reply(`Benar, *+${Func.formatNumber(conn.guessactor[id][2])}* EXP`).then(() => {
               users.exp += poin
               clearTimeout(conn.guessactor[id][3])
               delete conn.guessactor[id]
            })
         } else m.reply('Salah!')
      }
   }
   return true
}
module.exports = handler