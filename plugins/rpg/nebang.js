const timeout = 28800000
let handler = async (m, {
   conn,
   usedPrefix,
   text,
   Func
}) => {
   let aqua = db.data.users[m.sender].aqua
   let time = db.data.users[m.sender].lastnebang + 28800000
   if (aqua == 0) return m.reply(`*Pastikan kamu memiliki semua aqua*\nKetik :\n${usedPrefix}shop buy aqua 5`)
   if (new Date - db.data.users[m.sender].lastnebang < 28800000) throw `Anda sudah menebang\nMohon tunggu hasil tebangan mu\nTunggu selama ${msToTime(time - new Date())} lagi`
   if (db.data.users[m.sender].aqua > 9) {
      let kayus = `${Math.floor(Math.random() * 1000)}`.trim()
      let aquas = `${Math.floor(Math.random() * 10)}`.trim()
      let caps = `*Selamat kamu mendapatkan*\n\n`
      caps += `[ 🪵 ] +${kayus} kayu\n\n`
      caps += `Kamu sudah menghabiskan aqua -${aquas}`
      db.data.users[m.sender].kayu += kayus * 1
      db.data.users[m.sender].aqua -= aquas * 1
      db.data.users[m.sender].lastnebang = new Date * 1
      m.reply(caps)
      setTimeout(() => {
         //conn.reply(m.chat, `Waktunya nebang pohon lagi kak 😅`, m)
      }, timeout)
   } else m.reply(`Pastikan aqua kamu *10* untuk bisa nebang, Karena menguras tenaga`)
}
handler.help = ['nebang']
handler.tags = ['rpg']
handler.command = /^(nebang)/i
handler.group = handler.limit = handler.rpg = handler.register = 1
module.exports = handler

function msToTime(duration) {
   var milliseconds = parseInt((duration % 1000) / 100),
      seconds = Math.floor((duration / 1000) % 60),
      minutes = Math.floor((duration / (1000 * 60)) % 60),
      hours = Math.floor((duration / (1000 * 60 * 60)) % 24)
   hours = (hours < 10) ? "0" + hours : hours
   minutes = (minutes < 10) ? "0" + minutes : minutes
   seconds = (seconds < 10) ? "0" + seconds : seconds
   return hours + " jam " + minutes + " menit " + seconds + " detik"
}