const { createHash } = require('crypto')
let Reg = /\|?(.*)([.|] *?)([0-9]*)$/i
module.exports = {
   help: ['reg'],
   use: 'name.age',
   tags: ['user'],
   run: async (m, {
      conn,
      usedPrefix,
      command,
      text,
      users,
      Func
   }) => {
      try {
         if (users.registered === true) return conn.reply(m.chat, 'Your number is already registered.', m)
         if (!Reg.test(text)) return conn.reply(m.chat, Func.example(usedPrefix, command, 'Lorem.17'), m)
         let [_, name, splitter, age] = text.match(Reg)
         if (!name) return conn.reply(m.chat, 'Enter your name.', m)
         if (!age) return conn.reply(m.chat, 'Enter your age.', m)
         age = parseInt(age)
         if (name.length > 20) return conn.reply(m.chat, 'Name is too long.', m)
         if (age > 80) return conn.reply(m.chat, 'Age is too old.', m)
         if (age < 5) return conn.reply(m.chat, 'Age is too young.', m)
         let sn = createHash('md5').update(m.sender).digest('hex')
         let capt = `Registered successfully\n\n`
         capt += `• Name : ${name}\n`
         capt += `• Age : ${age}\n`
         capt += `• SN : ${sn}\n\n`
         capt += `+ 100 limit\n`
         capt += `+ 20.000 exp\n`
         capt += `+ 10.000 money`
         conn.reply(m.chat, capt, m).then(() => {
            users.name = name.trim()
            users.age = age
            users.regTime = +new Date()
            users.registered = true
            users.limit += 100
            users.exp += 20000
            users.money += 10000
         })
      } catch (e) {
         console.log(e)
      }
   },
   private: true
}