module.exports = {
   run: async (m, {
      conn,
      usedPrefix,
      command,
      text,
      Scraper,
      Func
   }) => {
      try {
         if (!text) return conn.reply(m.chat, Func.example(usedPrefix, command, 'var+_0x5377%3D%5B"Hello+World%21"%5D%3Bvar+a%3D_0x5377%5B0%5D%3Bfunction+MsgBox%28_0x82a8x3%29%7Balert%28_0x82a8x3%29%3B%7D%3BMsgBox%28a%29%3B'), m)
         m.react('🕒')
         let json = await Api.get('api/deobfuscator', {
            code: text
         })
         if (!json.status) return conn.reply(m.chat, Func.jsonFormat(json), m)
         conn.reply(m.chat, Func.jsonFormat(json.data), m)
      } catch (e) {
         return conn.reply(m.chat, Func.jsonFormat(e), m)
      }
   },
   help: ['deobfuscator'],
   use: 'link',
   command: /^(deobfuscator|denc)$/i,
   tags: 'tools',
   premium: true
}