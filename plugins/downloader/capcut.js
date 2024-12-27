module.exports = {
   help: ['capcut'],
   command: ['capcutwm'],
   use: 'link',
   tags: ['downloader'],
   run: async (m, {
      conn,
      usedPrefix,
      command,
      args,
      Func
   }) => {
      try {
         if (!args[0]) return conn.reply(m.chat, Func.example(usedPrefix, command, 'https://www.capcut.com/template-detail/7355407233057950983?template_id=7355407233057950983&share_token=2fbab1d5-37fa-42ab-a00f-9d181da79409&enter_from=template_detail&region=ID&language=in&platform=copy_link&is_copy_link=1'), m)
         if (!args[0].match('capcut.com')) return conn.reply(m.chat, global.status.invalid, m)
         m.react('🕒')
         if (command == 'capcut') {
            var json = await Api.get('api/capcut-dl', {
               url: args[0], type: 'nowatermark'
            })
            if (!json.status) return m.reply(Func.jsonFormat(json))
            conn.sendFile(m.chat, json.data.url, Func.filename('mp4'), `◦ *Title* : ${json.data.title}\n◦ *Description* : ${json.data.description}`, m)
         } else if (command == 'capcutwm') {
            var json = await Api.get('api/capcut-dl', {
               url: args[0], type: 'watermark'
            })
            if (!json.status) return m.reply(Func.jsonFormat(json))
            conn.sendFile(m.chat, json.data[0].url, Func.filename('mp4'), `◦ *Title* : ${json.title}`, m)
         }
      } catch (e) {
         return conn.reply(m.chat, Func.jsonFormat(e), m)
      }
   },
   limit: true
}