let handler = async (m, {
  conn,
  command,
  text
}) => {
  if (!text) return m.reply(`Siapa yang *${command.replace('how', '').toUpperCase()}*`)
  conn.reply(m.chat, `
    ${command} *${text}*
    *${text}* is *${Math.floor(Math.random() * 101)}*% ${command.replace('how', '').toUpperCase()}
    `.trim(), m, m.mentionedJid ? {
    contextInfo: {
      mentionedJid: m.mentionedJid
    }
  } : {})
}
handler.help = ['gay', 'pintar', 'cantik', 'ganteng', 'gabut', 'gila', 'lesbi', 'stress', 'bucin', 'jones', 'sadboy'].map(v => 'how' + v + ' ')
handler.tags = ['fun']
handler.command = /^how(gay|pintar|cantik|ganteng|gabut|gila|lesbi|stress?|bucin|jones|sadboy)/i
handler.group = true
module.exports = handler