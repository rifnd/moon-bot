let handler = async (m, { conn, text }) => {
  if (!text) return m.reply('Apanya yang benar?')
  conn.reply(m.chat, `
*Pertanyaan:* ${m.text}
*Jawaban:* ${pickRandom(['Iya', 'Sudah pasti', 'Sudah pasti benar', 'Tidak', 'Tentu tidak', 'Sudah pasti tidak'])}
`.trim(), m, m.mentionedJid ? {
    contextInfo: {
      mentionedJid: m.mentionedJid
    }
  } : {})
}
handler.help = ['benarkah?']
handler.tags = ['fun']
handler.customPrefix = /(\?$)/
handler.command = /^bene?a?r(kah)?$/i
module.exports = handler

function pickRandom(list) {
  return list[Math.floor(Math.random() * list.length)]
}
