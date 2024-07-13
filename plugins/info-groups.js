let handler = async (m, {
   conn,
   participants
}) => {
   let now = new Date() * 1
   let groups = Object.entries(conn.chats).filter(([jid, chat]) => jid.endsWith('@g.us') && chat.isChats && !chat.metadata?.read_only && !chat.metadata?.announce).map(v => v[0])
   let txt = ''
   for (let [jid, chat] of Object.entries(conn.chats).filter(([jid, chat]) => jid.endsWith('@g.us') && chat.isChats))
      txt += `${await conn.getName(jid)}\n${jid} [${chat?.metadata?.read_only ? 'Left' : 'Joined'}]\n${db.data.chats[jid] == undefined ? db.data.chats[jid] = { isBanned: false, welcome: false, antiLink: false, delete: true } : db.data.chats[jid].expired ? Func.toDate(db.data.chats[jid].expired - now) : '*NOT SET*'}
${db.data.chats[jid].isBanned ? '✅' : '❌'} *Group Banned*
${db.data.chats[jid].welcome ? '✅' : '❌'} *Auto Welcome*
${db.data.chats[jid].antiLink ? '✅' : '❌'} *Anti Link*\n\n`
   m.reply(`–  *G R O U P S - L I S T*\n\n*“Bot has joined into ${groups.length} groups”*\n\n${txt}${global.set.footer}`.trim())
}
handler.help = ['groups']
handler.tags = ['info']
handler.command = ['groups', 'listgc']
module.exports = handler