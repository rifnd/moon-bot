const decode = require('html-entities').decode
module.exports = {
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
         if (!args || !args[0]) return conn.reply(m.chat, Func.example(usedPrefix, command, 'https://drive.google.com/file/d/1SluvqDGhjFqg2f-74RJB8DjobcCZO_rY/view?usp=drive_link'), m)
         if (!args[0].match('drive.google.com')) return conn.reply(m.chat, global.status.invalid, m)
         m.react('🕒')
         var json = await Api.get('api/gdrive', {
            url: args[0]
         })
         if (!json.status) return conn.reply(m.chat, Func.jsonFormat(json), m)
         const chSize = Func.sizeLimit(json.data.size, users.premium ? env.max_upload : env.max_upload_free)
         const isOver = users.premium ? `💀 File size (${json.data.size}) exceeds the maximum limit.` : `⚠️ File size (${json.data.size}), you can only download files with a maximum size of ${env.max_upload_free} MB and for premium users a maximum of ${env.max_upload} MB.`
         if (chSize.oversize) return conn.reply(m.chat, isOver, m)
         conn.sendFile(m.chat, json.data.url, json.data.filename, '', m)
      } catch (e) {
         console.log(e)
         return conn.reply(m.chat, Func.jsonFormat(e), m)
      }
   },
   help: ['gdrive'],
   use: 'link',
   tags: ['downloader'],
   command: /^(gdrive|googledrive)$/i,
   limit: true
}