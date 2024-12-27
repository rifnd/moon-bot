const moment = require('moment-timezone')
moment.tz.setDefault(process.env.TZ)
let handler = async (m, {
   conn,
   usedPrefix,
   command,
   text,
   Func
}) => {
   if (command == '+cmd') {
      if (!m.quoted || !/webp/.test(m.quoted.mimetype)) return conn.reply(m.chat, Func.texted('bold', `🚩 Reply sticker that will be used as sticker command.`), m)
      if (!text) return conn.reply(m.chat, Func.texted('bold', `🚩 Berikan teks atau command.`), m)
      let hash = m.quoted.fileSha256.toString('base64')
      if (typeof global.db.sticker[hash] != 'undefined') return conn.reply(m.chat, `${Func.texted('bold', `🚩 Sticker is already in the database with text / command`)} : ${Func.texted('monospace', global.db.sticker[hash].text)}`, m)
      global.db.sticker[hash] = {
         text: text,
         created: new Date() * 1
      }
      conn.reply(m.chat, `${Func.texted('bold', `🚩 Sticker successfully set as text / command`)} : ${Func.texted('monospace', text)}`, m)
   } else if (command == '+cmd') {
      if (!m.quoted || !/webp/.test(m.quoted.mimetype)) return conn.reply(m.chat, Func.texted('bold', `🚩 Reply sticker that will be removed from the sticker command list.`), m)
      let hash = m.quoted.fileSha256.toString('base64')
      if (typeof global.db.sticker[hash] == 'undefined') return conn.reply(m.chat, Func.texted('bold', `🚩 Sticker is not in the database.`), m)
      delete global.db.sticker[hash]
      conn.reply(m.chat, Func.texted('bold', `🚩 Sticker command successfully removed.`), m)
   } else if (command == 'cmdlist') {
      let cmdS = Object.keys(global.db.sticker)
      if (cmdS.length == 0) return conn.reply(m.chat, Func.texted('bold', `🚩 No sticker commands.`), m)
      let teks = `乂  *C M D - L I S T*\n\n`
      for (let i = 0; i < cmdS.length; i++) {
         teks += Func.texted('bold', (i + 1) + '.') + ' ' + cmdS[i] + '\n'
         teks += '   ◦  ' + Func.texted('bold', 'Text') + ' : ' + global.db.sticker[cmdS[i]].text + '\n'
         teks += '   ◦  ' + Func.texted('bold', 'Created') + ' : ' + moment(global.db.sticker[cmdS[i]].created).format('DD/MM/YY HH:mm:ss') + '\n\n'
      }
      m.reply(teks + global.footer)
   }
}
handler.help = ['+cmd', '-cmd', 'cmdlist']
handler.tags = ['database']
handler.limit = true
module.exports = handler