let handler = async (m, {
   usedPrefix,
   command,
   args
}) => {
   if (!args[0]) return m.reply(Func.example(usedPrefix, command, 'https://www.tiktok.com/@yahh_016/video/7260960038582258950?is_from_webapp=1&sender_device=pc'))
   if (!args[0].match('tiktok.com')) return m.reply(status.invalid)
   m.react('🕐')
   let old = new Date()
   try {
      const json = await Func.fetchJson(API('alya', '/api/tiktok', {
         url: args[0]
      }, 'apikey'))
      if (!json.status) return m.reply(Func.jsonFormat(json))
      let teks = `–  *T I K T O K*\n\n`
      teks += `  ∘  *Author* : ${json.author.nickname}\n`
      teks += `  ∘  *Like* : ${json.stats.likes}\n`
      teks += `  ∘  *Share* : ${json.stats.share}\n`
      teks += `  ∘  *Comment* : ${json.stats.comment}\n`
      teks += `  ∘  *Duration* : ${json.duration}\n`
      teks += `  ∘  *Sound* : ${json.music_info.title} - ${json.music_info.author}\n`
      teks += `  ∘  *Caption* : ${json.title}\n`
      teks += `  ∘  *Fetching* : ${((new Date - old) * 1)} ms\n\n`
      teks += global.set.footer
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
      console.log(e)
      return m.reply(status.error)
   }
}
handler.help = ['tiktok', 'tikwm', 'tikmp3']
handler.tags = ['downloader']
handler.command = ['tiktok', 'tt', 'tikwm', 'tikmp3']
handler.limit = 1
module.exports = handler