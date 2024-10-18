module.exports = {
   help: ['tebaklagu'],
   tags: ['game'],
   command: /^(tebaklagu|tegu)$/i,
   run: async (m, {
      conn,
      usedPrefix,
      command,
      Func
   }) => {
      conn.tebaklagu = conn.tebaklagu ? conn.tebaklagu : {}
      let id = m.chat
      let timeout = 120000
      let poin = Func.randomInt('1000', '50000')
      if (command == 'tebaklagu') {
         if (id in conn.tebaklagu) conn.reply(m.chat, 'Masih ada soal belum terjawab di chat ini', conn.tebaklagu[id][0])
         let json = await Api.get('api/tebaklagu', {})
         if (!json.status) return m.reply(Func.jsonFormat(json))
         let audio = await conn.sendFile(m.chat, json.data.lagu, 'audio.mp3', '', m)
         let capt = `~ Tebak Lagu\n\n`
         capt += `Apa judul lagu ini?\n\n`
         capt += `Artis : ${json.data.artis}\n`
         capt += `Timeout : ${timeout / 60 / 1000} menit\n`
         capt += `Balas pesan ini untuk menjawab, kirim ${usedPrefix}tegu untuk bantuan\n\n`
         capt += '> ' + global.footer
         conn.tebaklagu[id] = [
            await conn.reply(m.chat, capt, audio),
            json,
            poin,
            setTimeout(() => {
               if (conn.tebaklagu[id]) conn.reply(m.chat, `Waktu habis!\nJawabannya adalah *${json.judul}*`, conn.tebaklagu[id][0])
               delete conn.tebaklagu[id]
            }, timeout)
         ]
      } else if (command == 'tegu') {
         if (!(id in conn.tebaklagu)) throw false
         let clue = conn.tebaklagu[id][1].data.judul.replace(/[bcdfghjklmnpqrstvwxyz]/g, '_')
         m.reply('```' + clue + '```')
      }
   },
   group: true,
   game: true,
   limit: true
}