const yts = require('yt-search')
module.exports = {
   help: ['play'],
   use: 'query',
   tags: ['downloader'],
   run: async (m, {
      conn,
      usedPrefix,
      command,
      text,
      users,
      env,
      Func
   }) => {
      try {
         if (!text) return m.reply(Func.example(usedPrefix, command, 'Dewi'))
         m.react('🕒')
         var ys = await (await yts(text)).all
         var yt = ys.filter(p => p.type == 'video')
         var json = await Api.get('api/yta', {
            url: yt[0].url
         })
         if (!json.status) return conn.reply(m.chat, Func.jsonFormat(json), m)
         var caption = `乂  *Y T - P L A Y*\n\n`
         caption += `   ∘  *Title* : ` + json.title + `\n`
         caption += `   ∘  *Size* : ` + json.data.size + `\n`
         caption += `   ∘  *Duration* : ` + json.duration + `\n`
         caption += `   ∘  *Quality* : ` + json.data.quality + '\n\n'
         caption += global.footer
         const chSize = Func.sizeLimit(json.data.size, users.premium ? env.max_upload : env.max_upload_free)
         const isOver = users.premium ? `💀 File size (${json.data.size}) exceeds the maximum limit.` : `⚠️ File size (${json.data.size}), you can only download files with a maximum size of ${env.max_upload_free} MB and for premium users a maximum of ${env.max_upload} MB.`
         if (chSize.oversize) return conn.reply(m.chat, isOver, m)
         conn.sendMessageModify(m.chat, caption, m, {
            largeThumb: true,
            thumbnail: json.thumbnail,
         }).then(async () => {
            conn.sendFile(m.chat, json.data.url, json.data.filename, '', m, {
               document: false,
               APIC: await Func.fetchBuffer(json.thumbnail)
            })
         })
      } catch (e) {
         return conn.reply(m.chat, Func.jsonFormat(e), m)
      }
   },
   limit: true
}