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
   conn.guesslyric = conn.guesslyric ? conn.guesslyric : {}
   if (m.quoted && /lyricclue/i.test(m.quoted.text)) {
      if (!(id in conn.guesslyric) && /lyricclue/i.test(m.quoted.text)) return m.reply('Soal itu telah berakhir')
      if (m.quoted.id == conn.guesslyric[id][0].key.id) {
         if (['Timeout', ''].includes(body)) return !0
         let json = JSON.parse(JSON.stringify(conn.guesslyric[id][1]))
         if (body.toLowerCase() == json.data.jawaban.toLowerCase().trim()) {
            await m.reply(`Benar, *+${Func.formatNumber(conn.guesslyric[id][2])}* EXP`).then(() => {
               users.exp += poin
               clearTimeout(conn.guesslyric[id][3])
               delete conn.guesslyric[id]
            })
         } else m.reply('Salah!')
      }
   }
   return true
}
module.exports = handler