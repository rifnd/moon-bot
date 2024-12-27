let handler = (m) => m
handler.before = async function (m, {
   conn,
   env,
   users,
   Func
}) {
   let id = m.chat
   conn.math = conn.math ? conn.math : {}
   if (!/^-?[0-9]+(\.[0-9]+)?$/.test(m.text)) return !0
   if (m.quoted && /Berapa hasil dari/i.test(m.quoted.text)) {
      if (!(id in conn.math) && /Berapa hasil dari/i.test(m.quoted.text)) return m.reply('Soal itu telah berakhir')
      let math = JSON.parse(JSON.stringify(conn.math[id][1]))
      if (m.text == math.result) {
         users.exp += math.bonus
         clearTimeout(conn.math[id][3])
         delete conn.math[id]
         m.react('✅').then(() => m.reply(`*+${math.bonus}* EXP`))
      } else {
         if (--conn.math[id][2] == 0) {
            clearTimeout(conn.math[id][3])
            delete conn.math[id]
            m.reply(`Kesempatan habis!`)
         } else m.react('❌')
      }
   }
   return !0
}
module.exports = handler