const TicTacToe = require("../lib/tictactoe")
let handler = async (m, { 
  conn, 
  usedPrefix, 
  command, 
  text, 
  isPrems 
}) => {
	let user = db.data.users[m.sender]
	conn.game = conn.game ? conn.game : {}
	if (Object.values(conn.game).find(room => room.id.startsWith('tictactoe') && [room.game.playerX, room.game.playerO].includes(m.sender))) throw '⚠️ Kamu masih didalam room game, ketik nyerah untuk keluar dari sesi room.'
	let room = Object.values(conn.game).find(room => room.state === 'WAITING' && (text ? room.name === text : true))
	// m.reply('[WIP Feature]')
	if (room) {
		m.reply('✅ Lawan ditemukan!')
		room.o = m.chat
		room.game.playerO = m.sender
		room.state = 'PLAYING'
		let arr = room.game.render().map(v => {
			return {
				X: '✖',
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
		let str = `
Menunggu @${room.game.currentTurn.split('@')[0]} Untuk memulai Permainan.

${arr.slice(0, 3).join('')}
${arr.slice(3, 6).join('')}
${arr.slice(6).join('')}

❏ *ID ROOM* ${room.id}

❏ *Aturan*
‣ Buat 3 baris tanda x/o secara vertikal, horizontal atau diagonal untuk menang
‣ Ketik *nyerah* untuk keluar dari permainan dan dinyatakan kalah.
`.trim()
		if (room.x !== room.o) await conn.reply(room.x, str, m, {
			mentions: conn.parseMention(str)
		})
		await conn.reply(room.o, str, m, {
			mentions: conn.parseMention(str)
		})
	} else {
		room = {
			id: 'tictactoe-' + (+new Date),
			x: m.chat,
			o: '',
			game: new TicTacToe(m.sender, 'o'),
			state: 'WAITING'
		}
		if (text) room.name = text
		m.reply('⌛ Menunggu Lawan' + (text ? ` mengetik command room dibawah ini
▢ *${usedPrefix}${command} ${text}*` : ''))
		conn.game[room.id] = room
	}
}

handler.help = ['tictactoe']
handler.tags = ['game']
handler.command = ['tictactoe', 'ttc', 'ttt', 'xo']
handler.limit = handler.game = handler.group = true
module.exports = handler