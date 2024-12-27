let handler = async (m, {
   conn,
   usedPrefix,
   command,
   args
}) => {
   if (command == '+expired') {
      if (!args[0] || isNaN(args[0])) return conn.reply(m.chat, Func.example(usedPrefix, command, '30'), m)
      let who
      if (m.isGroup) who = args[1] ? args[1] : m.chat
      else who = args[1]
      var jumlahHari = 86400000 * args[0]
      var now = new Date() * 1
      if (now < global.db.groups[who].expired)
         global.db.groups[who].expired += jumlahHari
      else global.db.groups[who].expired = now + jumlahHari
      conn.reply(m.chat, `Successfully set expiration days for group ${await conn.getName(who)}, for ${args[0]} days\n\n countdown : [ ${Func.toDate(global.db.groups[who].expired - now)} ] `, m)
   } else if (command == '-expired') {
      let who
      if (m.isGroup) who = args[1] ? args[1] : m.chat
      else who = args[1]
      if (new Date() * 1 < global.db.groups[who].expired)
         global.db.groups[who].expired = undefined
      else global.db.groups[who].expired = undefined
      conn.reply(m.chat, `Successfully removed the expiration day for this Group`, m)
   }
}
handler.help = ['+expired', '-expired']
handler.tags = ['owner']
handler.owner = handler.group = true
module.exports = handler