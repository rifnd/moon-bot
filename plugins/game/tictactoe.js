const TicTacToe = require('../../lib/tictactoe')
let handler = async (m, {
   conn,
   usedPrefix,
   command,
   text,
   Func
}) => {
   conn.ttt = conn.ttt ? conn.ttt : {}
   if (command == 'tictactoe' || command == 'ttt') {
      if (Object.values(conn.ttt).find(room => room.id.startsWith('tictactoe') && [room.game.playerX, room.game.playerO].includes(m.sender))) return conn.reply(m.chat, Func.texted('bold', '🚩 Kamu masih didalam room game, ketik nyerah untuk keluar dari sesi room.'), m)
      let room = Object.values(conn.ttt).find(room => room.state === 'WAITING' && (text ? room.name === text : true))
      if (room) {
         m.reply('Lawan ditemukan!')
         room.o = m.chat
         room.game.playerO = m.sender
         room.state = 'PLAYING'
         let arr = room.game.render().map(v => {
            return {
               X: '❌',
               O: '⭕',
               1: '1️⃣',
               2: '2️⃣',
               3: '3️⃣',
               4: '4️⃣',
               5: '5️⃣',
               6: '6️⃣',
               7: '7️⃣',
               8: '8️⃣',
               9: '9️⃣',
            }[v]
         })
         let str = 
`Room Id : ${room.id}

Menunggu @${room.game.currentTurn.split('@')[0]} Untuk memulai permainan.

${arr.slice(0, 3).join('')}
${arr.slice(3, 6).join('')}
${arr.slice(6).join('')}

Aturan :
- Buat 3 baris tanda x/o secara vertikal, horizontal atau diagonal untuk menang
- Ketik *nyerah* untuk keluar dari permainan dan dinyatakan kalah.`.trim()
         if (room.x !== room.o) await conn.reply(room.x, str, m)
         await conn.reply(room.o, str, m)
      } else {
         room = {
            id: 'tictactoe-' + (+new Date),
            x: m.chat,
            o: '',
            game: new TicTacToe(m.sender, 'o'),
            state: 'WAITING'
         }
         if (text) room.name = text
         m.reply('Menunggu Lawan' + (text ? ` mengetik perintah *${usedPrefix + command} ${text}*` : ''))
         conn.ttt[room.id] = room
      }
   } else if (command == 'tttdel') {
      if (conn.ttt) {
         delete conn.ttt
         conn.reply(m.chat, Func.texted('bold', `🚩 Sesi permainan tictactoe berhasil di hapus.`), m)
      } else if (conn.ttt) {
         conn.reply(m.chat, Func.texted('bold', `🚩 Tidak ada sesi tictactoe.`), m)
      }
   }
}
handler.help = ['tictactoe']
handler.tags = ['game']
handler.command = ['ttt', 'tttdel']
handler.limit = handler.game = handler.group = handler.register = true
module.exports = handler