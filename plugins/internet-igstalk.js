let handler = async (m, {
  usedPrefix,
  command,
  text
}) => {
  try {
    if (!text) return m.reply(Func.example(usedPrefix, command, 'bulansutena'))
    m.react('🕐')
    const json = await Func.fetchJson(API('alya', '/api/igstalk', { user: text }, 'apikey'))
    if (!json.status) return m.reply(Func.jsonFormat(json))
    let tek = `乂  *I G - S T A L K*\n\n`
    tek += `  ∘  *Username* : ` + json.data.username + '\n'
    tek += `  ∘  *Name* : ` + json.data.full_name + '\n'
    tek += `  ∘  *ID* : ` + json.data.id + '\n'
    tek += `  ∘  *Private* : ` + json.data.is_private + '\n'
    tek += `  ∘  *Followers* : ` + json.data.edge_followed_by.count + '\n'
    tek += `  ∘  *Followed* : ` + json.data.edge_follow.count + '\n'
    tek += `  ∘  *Url* : https://instagram.com/` + json.data.username + '\n'
    tek += `  ∘  *Bio* : ` + json.data.biography + '\n\n'
    tek += global.set.footer
    conn.sendFile(m.chat, json.data.profile_pic_url, '', tek, m)
  } catch (e) {
    console.log(e)
    m.reply(Func.jsonFormat(e))
  }
}
handler.help = ['igstalk']
handler.tags = ['internet']
handler.command = ['igstalk', 'instagramstalk']
handler.limit = true
module.exports = handler