module.exports = {
   help: ['+hide', '-hide'],
   tags: ['owner'],
   run: async (m, {
      conn,
      usedPrefix,
      command,
      text,
      plugins,
      setting,
      Func
   }) => {
      try {
         const categories = [...new Set(Object.values(Object.fromEntries(Object.entries(plugins).filter(([name, prop]) => prop.tags))).flatMap(v => v.tags))]
         if (!text) return conn.reply(m.chat, Func.example(usedPrefix, command, 'features'), m)
         if (!categories.includes(text.toLowerCase().trim())) return conn.reply(m.chat, Func.texted('bold', `🚩 ${text} category does not exist.`), m)
         if (command == '+hide') {
            if (setting.hidden.includes(text.toLowerCase().trim())) return conn.reply(m.chat, Func.texted('bold', `🚩 Category ${text} previously been hidden.`), m)
            setting.hidden.push(text.toLowerCase().trim())
            conn.reply(m.chat, Func.texted('bold', `🚩 ${text} category successfully hidden.`), m)
         } else if (command == '-hide') {
            if (!setting.hidden.includes(text.toLowerCase().trim())) return conn.reply(m.chat, Func.texted('bold', `🚩 ${text} category does not exist.`), m)
            setting.hidden.forEach((data, index) => {
               if (data === text.toLowerCase().trim()) setting.hidden.splice(index, 1)
            })
            conn.reply(m.chat, Func.texted('bold', `🚩 ${text} category has been removed from hidden list.`), m)
         }
      } catch (e) {
         conn.reply(m.chat, Func.jsonFormat(e), m)
      }
   },
   owner: true
}