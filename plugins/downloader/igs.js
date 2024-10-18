module.exports = {
   help: ['igs'],
   use: 'link / username',
   tags: ['downloader'],
   command: /^(igs|instagramstory|igstory)$/i,
   run: async (m, {
      conn,
      usedPrefix,
      command,
      args,
      Func
   }) => {
      try {
         if (!args || !args[0]) return conn.reply(m.chat, Func.example(usedPrefix, command, 'https://instagram.com/stories/pandusjahrir/3064777897102858938?igshid=MDJmNzVkMjY='), m)
         m.react('🕒')
         let old = new Date()
         var json = await Api.get('api/igs', {
            q: args[0]
         })
         if (!json.status) return m.reply(Func.jsonFormat(json))
         for (let i = 0; i < json.data.length; i++) {
            conn.sendFile(m.chat, json.data[i].url, ``, `🍟 *Fetching* : ${((new Date - old) * 1)} ms (${i + 1})`, m)
            await Func.delay(1500)
         }
      } catch (e) {
         console.log(e)
         return m.reply(Func.jsonFormat(e))
      }
   },
   limit: true
}