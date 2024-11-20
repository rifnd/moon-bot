module.exports = {
   help: ['plugen', 'plugdis'],
   use: 'plugin name',
   tags: ['owner'],
   command: /^(plugen|plugdis)$/i,
   run: async (m, {
      conn,
      usedPrefix,
      command,
      args,
      plugins: plugs,
      setting,
      Func
   }) => {
      if (!args || !args[0]) return conn.reply(m.chat, Func.example(usedPrefix, command, 'tiktok'), m)
      const pluginName = args[0].toLowerCase()
      const pluginFile = Object.keys(plugs).find((key) => {
         const fileName = key.split('/').pop().replace('.js', '').toLowerCase()
         return fileName === pluginName
      })
      if (!pluginFile) return conn.reply(m.chat, Func.texted('bold', `🚩 Plugin ${pluginName}.js not found.`), m)
      const fileName = pluginFile.split('/').pop()
      if (setting.pluginDisable.includes(fileName)) {
         if (command === 'plugdis') {
            return conn.reply(m.chat, Func.texted('bold', `🚩 Plugin ${fileName} is already disabled.`), m)
         }
      }
      if (command === 'plugdis') {
         if (!setting.pluginDisable.includes(fileName)) {
            setting.pluginDisable.push(fileName)
            global.db.data.setting.pluginDisable = setting.pluginDisable
            conn.reply(m.chat, Func.texted('bold', `🚩 Plugin ${fileName} successfully disabled.`), m)
         } else {
            return conn.reply(m.chat, Func.texted('bold', `🚩 Plugin ${fileName} is already disabled.`), m)
         }
      } else if (command === 'plugen') {
         if (setting.pluginDisable.includes(fileName)) {
            setting.pluginDisable = setting.pluginDisable.filter(plugin => plugin !== fileName)
            global.db.data.setting.pluginDisable = setting.pluginDisable
            conn.reply(m.chat, Func.texted('bold', `🚩 Plugin ${fileName} successfully enabled.`), m)
         } else {
            return conn.reply(m.chat, Func.texted('bold', `🚩 Plugin ${fileName} is not disabled.`), m)
         }
      }
   },
   owner: true
}