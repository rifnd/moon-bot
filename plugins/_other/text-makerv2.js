module.exports = {
   help: ['birthday', 'ruby-3d', 'underwater', 'purple-metal', 'cool-metal', 'galaxy-text', 'light-text', 'paper-cut', 'glow-text', 'bulbs-text', 'blue-metal', 'black-snake', 'ice-cream', 'gold-text', 'matrix'],
   use: 'text',
   tags: ['text maker'],
   run: async (m, {
      conn,
      usedPrefix,
      command,
      text,
      Func
   }) => {
      try {
         if (!text) return conn.reply(m.chat, Func.example(usedPrefix, command, 'moonbot'), m)
         if (text.length > 10) return conn.reply(m.chat, Func.texted('bold', '🚩 Max 10 character'), m)
         m.react('🕒')
         let old = new Date()
         let json = await Api.get('api/textmakerv2', {
            text, style: command
         })
         if (!json.status) return conn.reply(m.chat, Func.jsonFormat(json), m)
         conn.sendFile(m.chat, json.data.url, '', `Process : ${((new Date - old) * 1)} ms`, m)
      } catch (e) {
         conn.reply(m.chat, Func.jsonFormat(json), m)
      }
   },
   limit: true
}