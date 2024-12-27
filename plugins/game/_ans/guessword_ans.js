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
   conn.guessword = conn.guessword ? conn.guessword : {}
   if (m.quoted && /wordclue/i.test(m.quoted.text)) {
      if (!(id in conn.guessword) && /wordclue/i.test(m.quoted.text)) return m.reply('Soal itu telah berakhir')
      if (m.quoted.id == conn.guessword[id][0].key.id) {
         if (['Timeout', ''].includes(body)) return !0
         let json = JSON.parse(JSON.stringify(conn.guessword[id][1]))
         if (body.toLowerCase() == json.data.jawaban.toLowerCase().trim()) {
            await m.reply(`Benar, *+${Func.formatNumber(conn.guessword[id][2])}* EXP`).then(() => {
               users.exp += poin
               clearTimeout(conn.guessword[id][3])
               delete conn.guessword[id]
            })
         } else m.reply('Salah!')
      }
   }
   return true
}
module.exports = handler