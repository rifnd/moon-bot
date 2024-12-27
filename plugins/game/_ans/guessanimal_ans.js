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
   conn.guessanimal = conn.guessanimal ? conn.guessanimal : {}
   if (m.quoted && /animalclue/i.test(m.quoted.text)) {
      if (!(id in conn.guessanimal) && /animalclue/i.test(m.quoted.text)) return m.reply('Soal itu telah berakhir')
      if (m.quoted.id == conn.guessanimal[id][0].key.id) {
         if (['Timeout', ''].includes(body)) return !0
         let json = JSON.parse(JSON.stringify(conn.guessanimal[id][1]))
         if (body.toLowerCase() == json.data.title.toLowerCase().trim()) {
            await m.reply(`Benar, *+${Func.formatNumber(conn.guessanimal[id][2])}* EXP`).then(() => {
               users.exp += poin
               clearTimeout(conn.guessanimal[id][3])
               delete conn.guessanimal[id]
            })
         } else m.reply('Salah!')
      }
   }
   return true
}
module.exports = handler