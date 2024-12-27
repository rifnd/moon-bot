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
   conn.guesscharacter = conn.guesscharacter ? conn.guesscharacter : {}
   if (m.quoted && /characterclue/i.test(m.quoted.text)) {
      if (!(id in conn.guesscharacter) && /characterclue/i.test(m.quoted.text)) return m.reply('Soal itu telah berakhir')
      if (m.quoted.id == conn.guesscharacter[id][0].key.id) {
         if (['Timeout', ''].includes(body)) return !0
         let json = JSON.parse(JSON.stringify(conn.guesscharacter[id][1]))
         if (body.toLowerCase() == json.data.title.toLowerCase().trim()) {
            await m.reply(`Benar, *+${Func.formatNumber(conn.guesscharacter[id][2])}* EXP`).then(() => {
               users.exp += poin
               clearTimeout(conn.guesscharacter[id][3])
               delete conn.guesscharacter[id]
            })
         } else m.reply('Salah!')
      }
   }
   return true
}
module.exports = handler