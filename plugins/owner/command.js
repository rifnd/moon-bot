module.exports = {
   help: ['+command', '-command'],
   use: 'command',
   tags: ['owner'],
   command: /^(\+command|\-command)$/i,
   run: async (m, {
      conn,
      usedPrefix,
      command,
      args,
      plugins,
      Func
   }) => {
      let cmd = global.db.data.setting
      if (!args || !args[0]) return conn.reply(m.chat, Func.example(usedPrefix, command, 'tiktok'), m)
      let commands = Func.arrayJoin(Object.values(Object.fromEntries(Object.entries(plugins).filter(([name, prop]) => prop.help))).map(v => v.help))
      if (!commands.includes(args[0])) return conn.reply(m.chat, Func.texted('bold', `🚩 Command ${usedPrefix + args[0]} does not exist.`), m)
      if (command == '-command') {
         if (cmd.error.includes(args[0])) return conn.reply(m.chat, Func.texted('bold', `🚩 ${usedPrefix + args[0]} command was previously disabled.`), m)
         cmd.error.push(args[0])
         conn.reply(m.chat, Func.texted('bold', `🚩 Command ${usedPrefix + args[0]} disabled successfully.`), m)
      } else if (command == '+command') {
         if (!cmd.error.includes(args[0])) return conn.reply(m.chat, Func.texted('bold', `🚩 Command ${usedPrefix + args[0]} does not exist.`), m)
         cmd.error.forEach((data, index) => {
            if (data === args[0]) cmd.error.splice(index, 1)
         })
         conn.reply(m.chat, Func.texted('bold', `🚩 Command ${usedPrefix + args[0]} successfully activated.`), m)
      }
   },
   owner: 1
}