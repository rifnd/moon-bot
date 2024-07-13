let timeout = 120000
let poin = Func.randomInt('1000', '50000')
let handler = async (m, {
   conn,
   usedPrefix,
   command
}) => {
   conn.whatplanet = conn.whatplanet ? conn.whatplanet : {}
   let id = m.chat
   if (command == 'whatplanet') {
      if (id in conn.whatplanet) return conn.reply(m.chat, 'There are still unanswered questions in this chat', conn.whatplanet[id][0])
      let json = await Func.fetchJson(API('alya', '/api/tebakplanet', {}, 'apikey'))
      if (!json.status) return m.reply(Func.jsonFormat(json))
      let capt = `– *What Planet*\n\n`
      capt += `Apa nama planet pada gambar ini?\n\n`
      capt += `Timeout : ${timeout / 60 / 1000} menit\n`
      capt += `Balas pesan ini untuk menjawab, kirim ${usedPrefix}planclue untuk bantuan`
      conn.whatplanet[id] = [
         await conn.sendMessage(m.chat, {
            image: { url: json.data.image }, caption: capt
         }, { quoted: m }),
         json,
         poin,
         setTimeout(() => {
            if (conn.whatplanet[id]) conn.reply(m.chat, `Waktu Habis!\nJawabannya adalah *${json.data.title}*`, conn.whatplanet[id][0])
            delete conn.whatplanet[id]
         }, timeout)
      ]
   } else if (command == 'planclue') {
      if (!(id in conn.whatplanet)) throw false
      let clue = conn.whatplanet[id][1].data.title.replace(/[AIUEOaiueo]/g, '_')
      conn.reply(m.chat, '```' + clue + '```', menubar)
   }
}
handler.help = ['whatplanet']
handler.tags = ['game']
handler.command = ['whatplanet', 'planclue']
handler.limit = handler.game = handler.group = true
module.exports = handler