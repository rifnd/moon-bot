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
   conn.guessflag = conn.guessflag ? conn.guessflag : {}
   if (m.quoted && /flagclue/i.test(m.quoted.text)) {
      if (!(id in conn.guessflag) && /flagclue/i.test(m.quoted.text)) return m.reply('Soal itu telah berakhir')
      if (m.quoted.id == conn.guessflag[id][0].key.id) {
         if (['Timeout', ''].includes(body)) return !0
         let json = JSON.parse(JSON.stringify(conn.guessflag[id][1]))
         if (body.toLowerCase() == json.data.name.toLowerCase().trim()) {
            await m.reply(`Benar, *+${Func.formatNumber(conn.guessflag[id][2])}* EXP`).then(() => {
               users.exp += poin
               clearTimeout(conn.guessflag[id][3])
               delete conn.guessflag[id]
            })
         } else m.reply('Salah!')
      }
   }
   return true
}
module.exports = handler