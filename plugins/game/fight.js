let handler = async (m, {
   conn,
   usedPrefix,
   participants,
   Func
}) => {
   conn.level = global.db.users[m.sender]
   conn.fight = conn.fight ? conn.fight : {}
   const delay = time => new Promise(res => setTimeout(res, time)), reward = Func.randomInt(env.min_reward, env.max_reward), minus = Func.randomInt(10000, 50000)
   if (typeof conn.fight[m.sender] != 'undefined' && conn.fight[m.sender] == true) return conn.reply(m.chat, Func.texted('bold', 'Tidak bisa melakukan pertarungan, karena kamu sedang bertarung.'), m)
   let users = participants.map(u => u.id)
   var lawan
   do {
      lawan = users[Math.floor(users.length * Math.random())]
   } while (typeof global.db.users[lawan] == "undefined" || lawan == m.sender || lawan == conn.user.jid)

   let lamaPertarungan = Func.randomInt(1, 2)
   conn.reply(m.chat, `乂  *F I G H T*\n\n*@${m.sender.split`@`[0]}* (level ${global.db.users[m.sender].level}) menantang *@${lawan.split`@`[0]}* (level ${global.db.users[lawan].level}) dan sedang dalam pertarungan sengit.\n\nTunggu ${lamaPertarungan} menit lagi dan lihat siapa yg menang.`, m)
   conn.fight[m.sender] = true
   await delay(1000 * 60 * lamaPertarungan)
   let alasanKalah = ['Noob', 'Cupu', 'Kurang hebat', 'Stress', 'Ampas kalahan', 'Gembel kalahan', 'Tolol', 'Goblok', 'Tidak berakal', 'Pendukung anies', 'Anak abah']
   let alasanMenang = ['Hebat', 'Pro', 'Master Game', 'Legenda game', 'Sangat Pro', 'Rajin Nge-push', 'Titisan dewa', 'Cerdas']
   let kesempatan = []
   for (let i = 0; i < global.db.users[m.sender].level; i++) kesempatan.push(m.sender)
   for (let i = 0; i < global.db.users[lawan].level; i++) kesempatan.push(lawan)
   let pointPemain = 0
   let pointLawan = 0
   for (let i = 0; i < 10; i++) {
      let unggul = Func.randomInt(0, kesempatan.length - 1)
      if (kesempatan[unggul] == m.sender) pointPemain += 1
      else pointLawan += 1
   }
   if (pointPemain > pointLawan) {
      let hadiah = (pointPemain - pointLawan) * reward
      global.db.users[m.sender].exp = (global.db.users[m.sender].exp || 0) + hadiah
      conn.reply(m.chat, `*@${m.sender.split`@`[0]}* [${pointPemain * 10}] - [${pointLawan * 10}] *@${lawan.split`@`[0]}*\n\n*@${m.sender.split`@`[0]}* (level ${global.db.users[m.sender].level}) MENANG melawan *@${lawan.split`@`[0]}* (level ${global.db.users[lawan].level}) karena kamu ${alasanMenang[Func.randomInt(0, alasanMenang.length - 1)]}\n\nHadiah ${Func.formatNumber(hadiah)}`, m)
   } else if (pointPemain < pointLawan) {
      let denda = (pointLawan - pointPemain) * minus
      global.db.users[m.sender].exp = (global.db.users[m.sender].exp || 0) - denda
      conn.reply(m.chat, `*@${m.sender.split`@`[0]}* [${pointPemain * 10}] - [${pointLawan * 10}] *@${lawan.split`@`[0]}*\n\n*@${m.sender.split`@`[0]}* (level ${global.db.users[m.sender].level}) KALAH melawan *@${lawan.split`@`[0]}* (level ${global.db.users[lawan].level}) karena kamu ${alasanKalah[Func.randomInt(0, alasanKalah.length - 1)]}\n\nEXP kamu berkurang ${Func.formatNumber(denda)}`, m)
   } else {
      conn.reply(m.chat, `*@${m.sender.split`@`[0]}* [${pointPemain * 10}] - [${pointLawan * 10}] *@${lawan.split`@`[0]}*\n\nHasil imbang, ga dapet apa apa`, m)
   }
   delete conn.fight[m.sender]
}
handler.help = ['fighting']
handler.command = ['fight']
handler.tags = ['game']
handler.limit = handler.game = handler.group = handler.register = true
module.exports = handler