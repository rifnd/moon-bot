let handler = async (m, {
  usedPrefix,
  command,
  text
}) => {
  try {
    if (!text) return m.reply(Func.example(usedPrefix, command, 'nando.xyz'))
    m.react('🕐')
    const json = await Func.fetchJson(API('alya', '/api/ttstalk', { user: text }, 'apikey'))
    if (!json.status) return m.reply(Func.jsonFormat(json))
    let tek = `乂  *T I K T O K - S T A L K*\n\n`
    tek += ` ∘ *Username* : ${json.data.users.username}\n`
    tek += ` ∘ *Nickname* : ${json.data.users.nickname}\n`
    tek += ` ∘ *Verified* : ${json.data.users.verified}\n`
    tek += ` ∘ *Region* : ${json.data.users.region}\n`
    tek += ` ∘ *Followers* : ${json.data.stats.followerCount}\n`
    tek += ` ∘ *Followed* : ${json.data.stats.followingCount}\n`
    tek += ` ∘ *Like* : ${json.data.stats.heartCount}\n`
    tek += ` ∘ *Video* : ${json.data.stats.videoCount}\n\n`
    tek += global.set.footer
    conn.sendFile(m.chat, json.data.users.avatar, '', tek, m)
  } catch (e) {
    console.log(e)
    m.reply(Func.jsonFormat(e))
  }
}
handler.help = ['tiktokstalk']
handler.tags = ['internet']
handler.command = ['ttstalk', 'tiktokstalk']
handler.limit = true
module.exports = handler