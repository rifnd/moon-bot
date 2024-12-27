module.exports = {
   help: ['tiktok', 'tikmp3', 'tikwm'],
   command: ['tt'],
   use: 'link',
   tags: ['downloader'],
   run: async (m, {
      conn,
      usedPrefix,
      command,
      args,
      Func
   }) => {
      if (!args[0]) return m.reply(Func.example(usedPrefix, command, 'https://www.tiktok.com/@cikaseiska/video/7379107227363200261?is_from_webapp=1&sender_device=pc&web_id=7330639260519974418'))
      if (!args[0].match('tiktok.com')) return m.reply(status.invalid)
      m.react('🕒')
      let old = new Date()
      try {
         var json = await Api.get('api/tiktok', {
            url: args[0]
         })
         if (!json.status) return m.reply(Func.jsonFormat(json))
         let teks = `乂  *T I K T O K*\n\n`
         teks += `   ∘  *Author* : ${json.author.nickname}\n`
         teks += `   ∘  *Like* : ${json.stats.likes}\n`
         teks += `   ∘  *Share* : ${json.stats.share}\n`
         teks += `   ∘  *Comment* : ${json.stats.comment}\n`
         teks += `   ∘  *Duration* : ${json.duration}\n`
         teks += `   ∘  *Sound* : ${json.music_info.title} - ${json.music_info.author}\n`
         teks += `   ∘  *Caption* : ${json.title}\n`
         teks += `   ∘  *Fetching* : ${((new Date - old) * 1)} ms\n\n`
         teks += global.footer
         if (command == 'tiktok' || command == 'tt') {
            let result = json.data.find(v => v.type == 'nowatermark')
            if (!result) {
               json.data.map(x => {
                  conn.sendFile(m.chat, x.url, Func.filename('jpg'), teks, m)
               })
            } else {
               conn.sendFile(m.chat, result.url, Func.filename('mp4'), teks, m)
            }
         } else if (command == 'tikwm') {
            conn.sendFile(m.chat, json.data.find(v => v.type == 'watermark').url, Func.filename('mp4'), teks, m)
         } else if (command == 'tikmp3') {
            conn.sendFile(m.chat, json.music_info.url, Func.filename('mp3'), '', m)
         }
      } catch (e) {
         return conn.reply(m.chat, Func.jsonFormat(e), m)
      }
   },
   limit: true
}