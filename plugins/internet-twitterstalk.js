let handler = async (m, {
  usedPrefix,
  command,
  text
}) => {
  try {
    if (!text) return m.reply(Func.example(usedPrefix, command, 'google'))
    m.react('🕐')
    const json = await Func.fetchJson(API('alya', '/api/twtstalk', { user: text }, 'apikey'))
    if (!json.status) return m.reply(Func.jsonFormat(json))
    let tek = `乂  *T W I T T E R - S T A L K*\n\n`
    tek += `  ∘  *Username* : ${json.data.username}\n`
    tek += `  ∘  *Nickname* : ${json.data.nickname}\n`
    tek += `  ∘  *Join At* : ${json.data.join_at}\n`
    tek += `  ∘  *Location* : ${json.data.location}\n`
    tek += `  ∘  *Tweets* : ${json.data.tweets_count}\n`
    tek += `  ∘  *Followers* : ${json.data.followers}\n`
    tek += `  ∘  *Followed* : ${json.data.following}\n`
    tek += `  ∘  *Bio* : ${json.data.biography}\n\n`
    tek += global.set.footer
    conn.sendFile(m.chat, json.data.profile, '', tek, m)
  } catch (e) {
    console.log(e)
    m.reply(Func.jsonFormat(e))
  }
}
handler.help = ['twitstalk']
handler.tags = ['internet']
handler.command = ['twitstalk', 'twitterstalk']
handler.limit = true
module.exports = handler