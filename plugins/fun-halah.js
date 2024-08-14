module.exports = {
   run: async (m, {
      conn,
      command,
      text,
      Func
   }) => {
      try {
         let ter = command[1].toLowerCase()
         let txt = m.quoted ? m.quoted.text ? m.quoted.text : text ? text : m.text : text ? text : m.text
         await conn.reply(m.chat, txt.replace(/[aiueo]/g, ter).replace(/[AIUEO]/g, ter.toUpperCase()), m)
      } catch (e) {
         console.log(e)
      }
   },
   help: [...'aiueo'].map(v => `h${v}l${v}h`),
   use: 'text',
   tags: ['fun'],
   command: /^h([aiueo])l\1h/i
}