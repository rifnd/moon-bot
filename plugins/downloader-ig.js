let handler = async (m, {
	usedPrefix,
	command,
	args
}) => {
	if (!args[0]) return m.reply(Func.example(usedPrefix, command, 'https://www.instagram.com/p/CvhKFLaLWXJ/?utm_source=ig_web_copy_link&igshid=MzRlODBiNWFlZA=='))
	if (!args[0].match(/(https:\/\/www.instagram.com)/gi)) return m.reply(status.invalid)
	let old = new Date()
	m.react('🕐')
	try {
		const json = await Func.fetchJson(API('alya', '/api/ig', {
			url: args[0]
		}, 'apikey'))
		if (!json.status) return m.reply(Func.jsonFormat(json))
		for (let v of json.data) {
			conn.sendMedia(m.chat, v.url, m, {
				caption: `• *Fetching* : ${((new Date - old) * 1)} ms`,
				fileName: v.type == 'video' ? Func.filename('mp4') : Func.filename('jpg')
			})
		}
	} catch (e) {
		console.log(e)
		return m.reply(status.error)
	}
}
handler.help = ['instagram']
handler.tags = ['downloader']
handler.command = ['ig', 'instagram']
handler.limit = 1
module.exports = handler