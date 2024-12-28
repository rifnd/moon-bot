let handler = async (m, {
   conn,
   text,
   Func
}) => {
   if (!text) return m.reply('Apanya yang benar?')
   conn.reply(m.chat, `*Pertanyaan:* ${m.text}\n*Jawaban:* ${Func.random(['Iya', 'Sudah pasti', 'Sudah pasti benar', 'Tidak', 'Tentu tidak', 'Sudah pasti tidak'])}`.trim(), m, m.mentionedJid ? {
      contextInfo: {
         mentionedJid: m.mentionedJid
      }
   } : {})
}
handler.help = ['benarkah']
handler.tags = ['random']
module.exports = handler