module.exports = {
   help: ['ytmp3'],
   use: 'link',
   tags: ['downloader'],
   command: /^(ytmp3|yta)$/i,
   run: async (m, {
      conn,
      usedPrefix,
      command,
      args,
      users,
      env,
      Func
   }) => {
      try {
         if (!args[0]) return m.reply(Func.example(usedPrefix, command, 'https://youtu.be/zaRFmdtLhQ8'))
         if (!/^(?:https?:\/\/)?(?:www\.|m\.|music\.)?youtu\.?be(?:\.com)?\/?.*(?:watch|embed)?(?:.*v=|v\/|\/)([\w\-_]+)\&?/.test(args[0])) return m.reply(status.invalid)
         m.react('🕒')
         var json = await Api.get('api/yta', {
            url: args[0]
         })
         if (!json.status) return m.reply(Func.jsonFormat(json))
         let caption = `乂  *Y T - M P 3*\n\n`
         caption += `  ◦  *Title* : ${json.title}\n`
         caption += `  ◦  *Size* : ${json.data.size}\n`
         caption += `  ◦  *Duration* : ${json.duration}\n`
         caption += `  ◦  *Size* : ${json.data.size}\n\n`
         caption += global.footer
         const chSize = Func.sizeLimit(json.data.size, users.premium ? env.max_upload : env.max_upload_free)
         const isOver = users.premium ? `💀 File size (${json.data.size}) exceeds the maximum limit.` : `⚠️ File size (${json.data.size}), you can only download files with a maximum size of ${env.max_upload_free} MB and for premium users a maximum of ${env.max_upload} MB.`
         if (chSize.oversize) return conn.reply(m.chat, isOver, m)
         conn.sendMessageModify(m.chat, caption, m, {
            largeThumb: true,
            thumbnail: json.thumbnail
         }).then(async () => {
            conn.sendFile(m.chat, json.data.url, json.data.filename, '', m, {
               document: true,
               APIC: await Func.fetchBuffer(json.thumbnail)
            })
         })
      } catch (e) {
         console.log(e)
         return m.reply(Func.jsonFormat(e))
      }
   },
   limit: true
}