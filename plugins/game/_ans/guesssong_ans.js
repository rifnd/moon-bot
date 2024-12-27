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
   conn.guesssong = conn.guesssong ? conn.guesssong : {}
   if (m.quoted && /songclue/i.test(m.quoted.text)) {
      if (!(id in conn.guesssong) && /songclue/i.test(m.quoted.text)) return m.reply('Soal itu telah berakhir')
      if (m.quoted.id == conn.guesssong[id][0].key.id) {
         if (['Timeout', ''].includes(body)) return !0
         let json = JSON.parse(JSON.stringify(conn.guesssong[id][1]))
         if (body.toLowerCase() == json.data.judul.toLowerCase().trim()) {
            await m.reply(`Benar, *+${Func.formatNumber(conn.guesssong[id][2])}* EXP`).then(() => {
               users.exp += poin
               clearTimeout(conn.guesssong[id][3])
               delete conn.guesssong[id]
            })
         } else m.reply('Salah!')
      }
   }
   return true
}
module.exports = handler