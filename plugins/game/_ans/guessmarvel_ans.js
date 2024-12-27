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
   conn.guessmarvel = conn.guessmarvel ? conn.guessmarvel : {}
   if (m.quoted && /marvelclue/i.test(m.quoted.text)) {
      if (!(id in conn.guessmarvel) && /marvelclue/i.test(m.quoted.text)) return m.reply('Soal itu telah berakhir')
      if (m.quoted.id == conn.guessmarvel[id][0].key.id) {
         if (['Timeout', ''].includes(body)) return !0
         let json = JSON.parse(JSON.stringify(conn.guessmarvel[id][1]))
         if (body.toLowerCase() == json.data.title.toLowerCase().trim()) {
            await m.reply(`Benar, *+${Func.formatNumber(conn.guessmarvel[id][2])}* EXP`).then(() => {
               users.exp += poin
               clearTimeout(conn.guessmarvel[id][3])
               delete conn.guessmarvel[id]
            })
         } else m.reply('Salah!')
      }
   }
   return true
}
module.exports = handler