const {
    createHash
  } = require('crypto')
  let Reg = /\|?(.*)([.|] *?)([0-9]*)$/i
  let handler = async function(m, {
    text,
    usedPrefix,
    command
  }) {
    let user = db.data.users[m.sender]
    if (user.registered === true) return m.reply(`Nomor kamu sudah terdaftar, jika ingin daftar ulang kirim ${usedPrefix + command} sn`)
    if (!Reg.test(text)) return m.reply(Func.example(usedPrefix, command, 'nando.19'))
    let [_, name, splitter, age] = text.match(Reg);
    if (!name) return m.reply('Masukan nama kamu!')
    if (!age) return m.reply('Masukan umur kamu')
    age = parseInt(age)
    if (name.length > 20) return m.reply(`Nama terlalu panjang.`)
    if (age > 80) return m.reply('Umur terlalu tua')
    if (age < 5) return m.reply('Umur terlalu muda, emang bayi bisa ngetik?')
    user.name = name.trim()
    user.age = age
    user.regTime = +new Date()
    user.registered = true
    let sn = createHash('md5').update(m.sender).digest('hex')
    let teks = `
     - Nama : ${name}
     - Umur : ${age} tahun
     - SN : ${sn}
  `
    m.reply(`✅ Pendaftaran berhasil`)
  }
  handler.help = ['register'].map((v) => v + '')
  handler.tags = ['xp']
  handler.command = ['reg', 'register', 'daftar']
  module.exports = handler
  