let timeout = 120000
let poin = Func.randomInt('1000', '50000')
let handler = async (m, {
   conn,
   usedPrefix,
   command
}) => {
   conn.whatartist = conn.whatartist ? conn.whatartist : {}
   let id = m.chat
   if (command == 'whatartist') {
      if (id in conn.whatartist) return conn.reply(m.chat, 'There are still unanswered questions in this chat', conn.whatartist[id][0])
      let json = await Func.fetchJson(API('alya', '/api/tebakartist', {}, 'apikey'))
      if (!json.status) return m.reply(Func.jsonFormat(json))
      let capt = `– *What Artist*\n\n`
      capt += `Siapa Nama artis pada gambar ini?\n\n`
      capt += `Timeout : ${timeout / 60 / 1000} menit\n`
      capt += `Balas pesan ini untuk menjawab, kirim ${usedPrefix}artistclue untuk bantuan`
      conn.whatartist[id] = [
         await conn.sendMessage(m.chat, {
            image: { url: src.data.image }, caption: capt
         }, { quoted: m }),
         src,
         poin,
         setTimeout(() => {
            if (conn.whatartist[id]) conn.reply(m.chat, `Waktu Habis!\nJawabannya adalah *${json.data.title}*`, conn.whatartist[id][0])
            delete conn.whatartist[id]
         }, timeout)
      ]
   } else if (command == 'artistclue') {
      if (!(id in conn.whatartist)) throw false
      let clue = conn.whatartist[id][1].data.title.replace(/[AIUEOaiueo]/g, '_')
      conn.reply(m.chat, '```' + clue + '```', m)
   }
}
handler.help = ['whatartist']
handler.tags = ['game']
handler.command = ['whatartist', 'artistclue']
handler.limit = handler.game = handler.group = true
module.exports = handler