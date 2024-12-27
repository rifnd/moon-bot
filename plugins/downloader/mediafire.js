const axios = require('axios')
module.exports = {
   help: ['mediafire'],
   use: 'link',
   tags: ['downloader'],
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
         const chSize = Func.sizeLimit(json.data.size, users.premium ? env.max_upload : env.max_upload_free)
         const isOver = users.premium ? `💀 File size (${json.data.size}) exceeds the maximum limit.` : `⚠ File size (${json.data.size}), you can only download files with a maximum size of ${env.max_upload_free} MB and for premium users a maximum of ${env.max_upload} MB.`
         if (chSize.oversize) return conn.reply(m.chat, isOver, m)
         const buffer = await (await axios.request({
            url: json.data.url,
            method: 'GET',
            responseType: 'arraybuffer',
            headers: {
               'Cookie': json.data.cookies.join('; '),
               'User-Agent': 'Mozilla/5.0 (iPad; CPU OS 16_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.2 Mobile/15E148 Safari/605.1.15'
            }
         })).data
         await conn.sendFile(m.chat, buffer, json.data.filename, '', m)
      } catch (e) {
         return conn.reply(m.chat, Func.jsonFormat(e), m)
      }
   },
   limit: true
}