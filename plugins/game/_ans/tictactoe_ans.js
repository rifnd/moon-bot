let handler = m => m
let winScore = 50000
let playScore = 20000
handler.before = async function (m, {
   conn,
   prefixes,
   body,
   env,
   Func
}) {
   let ok
   let isWin = !1
   let isTie = !1
   let isSurrender = !1
   conn.ttt = conn.ttt ? conn.ttt : {}
   let room = Object.values(conn.ttt).find(room => room.id && room.game && room.state && room.id.startsWith('tictactoe') && [room.game.playerX, room.game.playerO].includes(m.sender) && room.state == 'PLAYING')
   if (room) {
      if (!/^([1-9]|(me)?nyerah|surr?ender)$/i.test(m.text)) return !0
      isSurrender = !/^[1-9]$/.test(m.text)
      if (m.sender !== room.game.currentTurn) {
         if (!isSurrender) return !0
      }
      if (!isSurrender && 1 > (ok = room.game.turn(m.sender === room.game.playerO, parseInt(m.text) - 1))) {
         m.reply({ '-3': 'Game telah berakhir', '-2': 'Invalid', '-1': 'Posisi Invalid', 0: 'Posisi Invalid' }[ok])
         return !0
      }
      if (m.sender === room.game.winner)
         isWin = true
      else if (room.game.board === 511)
         isTie = true
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
      if (isSurrender) {
         room.game._currentTurn = m.sender === room.game.playerX
         isWin = true
      }
      let winner = isSurrender ? room.game.currentTurn : room.game.winner
      let str = `
Room id : ${room.id}

${arr.slice(0, 3).join('')}
${arr.slice(3, 6).join('')}
${arr.slice(6).join('')}

${isWin ? `@${winner.split('@')[0]} Menang dan mendapatkan *+${Func.formatNumber(winScore)}* EXP` : isTie ? `Game telah berakhir! hasil seri *+${Func.formatNumber(playScore)}* EXP` : `Giliran @${room.game.currentTurn.split('@')[0]}`}

- @${room.game.playerX.split('@')[0]} : ❌
- @${room.game.playerO.split('@')[0]} : ⭕

Ketik *nyerah* untuk nyerah`.trim()
      let users = global.db.users
      if ((room.game._currentTurn ^ isSurrender ? room.x : room.o) !== m.chat)
      room[room.game._currentTurn ^ isSurrender ? 'x' : 'o'] = m.chat
      if (room.x !== room.o) await conn.reply(room.x, str, m)
      await conn.reply(room.o, str, m)
      if (isTie || isWin) {
         users[room.game.playerX].exp += playScore
         users[room.game.playerO].exp += playScore
         if (isWin)
            users[winner].exp += winScore - playScore
         delete conn.ttt[room.id]
      }
   }
   return !0
}
module.exports = handler