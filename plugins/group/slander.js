let handler = async (m, {
   conn, usedPrefix, command, text, Func
}) => {
   if (!text) return
   let cm = copy(m)
   let who
   if (text.includes('@0')) who = '0@s.whatsapp.net'
   else if (m.isGroup) who = cm.participant = m.mentionedJid[0]
   else who = m.chat
   if (!who) return conn.reply(m.chat, Func.texted('bold', '🚩 Tag the person you want to slander'), m)
   cm.key.fromMe = false
   cm.message[m.mtype] = copy(m.msg)
   let sp = '@' + who.split`@`[0]
   let [fake, ...real] = text.split(sp)
   conn.fakeReply(m.chat, real.join(sp).trimStart(), who, fake.trimEnd(), m.isGroup ? m.chat : false, {
      contextInfo: {
         mentionedJid: Func.mention(real.join(sp).trim())
      }
   })
}
handler.help = ['slander']
handler.use = ['@mention text']
handler.tags = ['group']
module.exports = handler

function copy(obj) {
   return JSON.parse(JSON.stringify(obj))
}