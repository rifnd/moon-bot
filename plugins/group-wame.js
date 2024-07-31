module.exports = {
   run: async (m, {
      conn,
      text
   }) => {
      let number = m.quoted ? (m.quoted.sender).split`@`[0] : (m.sender).split`@`[0]
      let chat = text ? text : 'hai'
      conn.reply(m.chat, `https://wa.me/${number}?text=${encodeURI(chat)}`, m)
   },
   help: ['wame'],
   tags: ['group'],
   command: /^(wame)$/i
}