const { createHash } = require('crypto')
let Reg = /\|?(.*)([.|] *?)([0-9]*)$/i
let handler = async function (m, {
   text,
   usedPrefix,
   command
}) {
   let user = db.data.users[m.sender]
   if (user.registered === true) return m.reply(`Your number has been registered, if you want to re-register, send it ${usedPrefix + command} sn`)
   if (!Reg.test(text)) return m.reply(Func.example(usedPrefix, command, 'nando.19'))
   let [_, name, splitter, age] = text.match(Reg)
   if (!name) return m.reply(Func.texted('bold', '🚩 Enter your name'))
   if (!age) return m.reply(Func.texted('bold', '🚩 Enter your age'))
   age = parseInt(age)
   if (name.length > 20) return m.reply(Func.texted('bold', '🚩 Name is too long'))
   if (age > 80) return m.reply(Func.texted('bold', '🚩 Age is too old'))
   if (age < 5) return m.reply(Func.texted('bold', '🚩 Too young, can babies type?'))
   user.name = name.trim()
   user.age = age
   user.regTime = +new Date()
   user.registered = true
   user.limit += 100
   user.exp += 20000
   user.money += 10000
   let sn = createHash('md5').update(m.sender).digest('hex')
   let teks = `*Registered successfully*
    
∘ Name : ${name}
∘ Age : ${age} years old
∘ SN : ${sn}
  
+ 100 limit
+ 20.000 exp
+ 10.000 money`
   m.reply(teks)
}
handler.help = ['register'].map((v) => v + '')
handler.tags = ['xp']
handler.command = ['reg', 'register', 'daftar']
module.exports = handler