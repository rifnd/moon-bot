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
         if (!args || !args[0]) return conn.reply(m.chat, Func.example(usedPrefix, command, 'https://www.mediafire.com/file/c2fyjyrfckwgkum/ZETSv1%25282%2529.zip/file'), m)
         if (!args[0].match(/(https:\/\/www.mediafire.com\/)/gi)) return conn.reply(m.chat, global.status.invalid, m)
         m.react('🕒')
         var json = await Api.get('api/mediafire', {
            url: args[0]
         })
         if (!json.status) return conn.reply(m.chat, Func.jsonFormat(json), m)
         let text = `乂  *M E D I A F I R E*\n\n`
         text += '	◦  *Name* : ' + unescape(decode(json.data.filename)) + '\n'
         text += '	◦  *Size* : ' + json.data.filesize + '\n'
         text += '	◦  *Extension* : ' + json.data.ext + '\n'
         text += '	◦  *Mime* : ' + json.data.filetype + '\n'
         text += '	◦  *Uploaded* : ' + json.data.uploadAt + '\n\n'
         text += global.footer
         const chSize = Func.sizeLimit(json.data.filesize, users.premium ? env.max_upload : env.max_upload_free)
         const isOver = users.premium ? `💀 File size (${json.data.filesize}) exceeds the maximum limit.` : `⚠️ File size (${json.data.filesize}), you can only download files with a maximum size of ${env.max_upload_free} MB and for premium users a maximum of ${env.max_upload} MB.`
         if (chSize.oversize) return conn.reply(m.chat, isOver, m)
         conn.sendMessageModify(m.chat, text, m, {
            largeThumb: true,
            thumbnail: 'https://telegra.ph/file/fcf56d646aa059af84126.jpg'
         }).then(async () => {
            conn.sendFile(m.chat, json.data.link, unescape(decode(json.data.filename)), '', m)
         })
      } catch (e) {
         console.log(e)
         return conn.reply(m.chat, Func.jsonFormat(e), m)
      }
   },
   help: ['mediafire'],
   use: 'link',
   tags: ['downloader'],
   command: /^(mediafire|mf)$/i,
   limit: true
}