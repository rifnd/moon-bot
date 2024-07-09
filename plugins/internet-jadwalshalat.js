let handler = async (m, {
	conn,
	usedPrefix, 
	command,
	text
}) => {
	try {
		if (!text) return conn.reply(m.chat, Func.example(usedPrefix, command, 'Surabaya'), m)
		m.react('🕒')
		const json = await Func.fetchJson(API('alya', '/api/jadwalsholat', { q: text }, 'apikey'))
		if (!json.status) return conn.reply(m.chat, Func.jsonFormat(json), m)
		let teks = '–  *J A D W A L S H A L A T*\n\n'
		teks += '  ◦  *Tanggal* : ' + json.data.tgl + '\n'
		teks += '  ◦  *Imsyak* : ' + json.data.imsyak + '\n'
		teks += '  ◦  *Subuh* : ' + json.data.subuh + '\n'
		teks += '  ◦  *Terbit* : ' + json.data.terbit + '\n'
		teks += '  ◦  *Dhuha* : ' + json.data.dhuha + '\n'
		teks += '  ◦  *Dzuhur* : ' + json.data.dzuhur + '\n'
		teks += '  ◦  *Asar* : ' + json.data.ashr + '\n'
		teks += '  ◦  *Maghrib* : ' + json.data.maghrib + '\n'
		teks += '  ◦  *Isya* : ' + json.data.isya + '\n\n'
		teks += json.data.parameter
		m.reply(teks)
	} catch (e) {
		console.log(e)
		return conn.reply(m.chat, Func.jsonFormat(e), m)
	}
}
handler.help = ['jadwalshalat']
handler.tags = ['internet']
handler.command = /^(jadwalsh(a|o)lat)$/i
handler.limit = true
module.exports = handler