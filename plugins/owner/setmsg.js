module.exports = {
   help: ['setmsg'],
   use: 'text',
   tags: ['owner'],
   command: /^(setmsg)$/i,
   run: async (m, {
      conn,
      usedPrefix,
      command,
      text,
      Func
   }) => {
      try {
         let setting = global.db.data.setting
         if (!text) return conn.reply(m.chat, explain(usedPrefix, command), m)
         setting.msg = text
         conn.reply(m.chat, Func.texted('bold', `🚩 Menu Message successfully set.`), m)
      } catch (e) {
         conn.reply(m.chat, Func.jsonFormat(e), m)
      }
   },
   owner: true
}

const explain = (prefix, command) => {
   return `Sorry, can't return without text, and this explanation and how to use :

*1.* +tag : for mention sender.
*2.* +name : to getting sender name.
*3.* +greeting : to display greetings by time.

• *Example* : ${prefix + command} Hi +tag +greeting, i'm an automation system`
}