module.exports = {
   help: ['diffusion'],
   command: ['stablediffusion', 'stablediff'],
   use: 'prompt',
   tags: ['ai'],
   run: async (m, {
      conn,
      usedPrefix,
      command,
      text,
      Func
   }) => {
      try {
         if (!text) return conn.reply(m.chat, Func.example(usedPrefix, command, 'girl anime'), m)
         conn.sendReact(m.chat, '🕒', m.key)
         let json = await Api.get('api/diffusion', {
            prompt: text
         })
         if (!json.status) return conn.reply(m.chat, `🚩 ${json.msg}`, m)
         for (let i = 0; i < 3; i++) {
            let rand = Math.floor(json.data.length * Math.random())
            conn.sendFile(m.chat, json.data[rand].cover, Func.filename('jpg'), `🍟 *Prompt* : ${json.data[rand].prompt}`, m)
         }
      } catch (e) {
         return conn.reply(m.chat, Func.jsonFormat(e), m)
      }
   },
   limit: true,
   premium: true
}