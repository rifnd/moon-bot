let handler = async (m, {
  conn,
  usedPrefix,
  command,
  text
}) => {
  try {
    if (!text) return m.reply(Func.example(usedPrefix, command, 'nando.xyz'))
    m.react('🕐')
    const json = await Func.fetchJson(API('alya', '/api/ttstalk', { user: text }, 'apikey'))
    if (!json.status) return m.reply(Func.jsonFormat(json))
    let tek = `乂  *T I K T O K S T A L K*\n\n`
    tek += `  ∘  *Username* : ${json.data.uniqueid}\n`
    tek += `  ∘  *Nickname* : ${json.data.nickname}\n`
    tek += `  ∘  *Country* : ${json.data.country}\n`
    tek += `  ∘  *Followers* : ${Func.formatNumber(json.data.follower)}\n`
    tek += `  ∘  *Followed* : ${Func.formatNumber(json.data.following)}\n`
    tek += `  ∘  *Like* : ${Func.formatNumber(json.data.hearcount)}\n`
    tek += `  ∘  *Video* : ${Func.formatNumber(json.data.videocount)}\n\n`
    tek += global.set.footer
	conn.sendMessageModify(m.chat, tek, m, {
		largeThumb: true,
		thumbnail: json.data.thumbnail
	})
  } catch (e) {
    console.log(e)
    m.reply(Func.jsonFormat(e))
  }
}
handler.help = ['ttstalk'].map(v => v + ' *username*')
handler.tags = ['internet']
handler.command = ['ttstalk', 'tiktokstalk']
handler.limit = true
module.exports = handler