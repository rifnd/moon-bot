let handler = async (m, { conn, text, usedPrefix }) => {
  function msToDate(ms) {
    temp = ms
    days = Math.floor(ms / (24 * 60 * 60 * 1000));
    daysms = ms % (24 * 60 * 60 * 1000);
    hours = Math.floor((daysms) / (60 * 60 * 1000));
    hoursms = ms % (60 * 60 * 1000);
    minutes = Math.floor((hoursms) / (60 * 1000));
    minutesms = ms % (60 * 1000);
    sec = Math.floor((minutesms) / (1000));
    return days + " Hari " + hours + " Jam " + minutes + " Menit";
  }

  let users = global.db.data.users
  let { registered, name } = global.db.data.users[m.sender]

  var text = ""
  var i = 1
  for (let jid in users) {
    if (users[jid].premium) {
      text += `\n${i}. @${jid.replace(/@.+/, '')}\n    ${msToDate(global.db.data.users[jid].premiumDate - new Date() * 1)}\n`
      i += 1
    }
  }

  return conn.reply(m.chat, `Total *"${i - 1}"* User${text}`, m, { contextInfo: { mentionedJid: conn.parseMention(text) } })
}
handler.help = ['premlist']
handler.tags = ['info']
handler.command = /^(listpremium|premiumlist|listprem|premlist)$/i
handler.limit = true
module.exports = handler