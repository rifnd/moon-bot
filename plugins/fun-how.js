module.exports = {
   run: async (m, {
      conn,
      command,
      text,
      Func
   }) => {
      try {
         if (!text) return m.reply(`Siapa yang *${command.replace('how', '').toUpperCase()}*`)
         conn.reply(m.chat, `${command} *${text}* *${text}* is *${Math.floor(Math.random() * 101)}*% ${command.replace('how', '').toUpperCase()}`.trim(), m, m.mentionedJid ? {
            contextInfo: {
               mentionedJid: m.mentionedJid
            }
         } : {})
      } catch (e) {
         console.log(e)
      }
   },
   help: ['gay', 'pintar', 'cantik', 'ganteng', 'gabut', 'gila', 'lesbi', 'stress', 'bucin', 'jones', 'sadboy'].map(v => 'how' + v + ' '),
   tags: ['fun'],
   command: /^how(gay|pintar|cantik|ganteng|gabut|gila|lesbi|stress?|bucin|jones|sadboy)/i
}