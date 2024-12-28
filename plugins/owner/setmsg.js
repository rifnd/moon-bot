module.exports = {
   help: ['setmsg', 'setgrmsg'],
   use: 'text',
   tags: ['owner'],
   run: async (m, {
      conn,
      usedPrefix,
      command,
      text,
      setting,
      Func
   }) => {
      try {
         if (!text) return conn.reply(m.chat, explain(usedPrefix, command), m)
         if (command === 'setmsg') {
            setting.msg = text
            conn.reply(m.chat, Func.texted('bold', `🚩 Menu Message successfully set.`), m)
         } else if (command === 'setgrmsg') {
            setting._msg = text
            conn.reply(m.chat, Func.texted('bold', `🚩 Greeting Message successfully set.`), m)
         }
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
*4.* +limit : to display sender limit.
*5.* +premium : display whether the sender is premium

• *Example* : ${prefix + command} Hi +tag +greeting, i'm an automation system`
}