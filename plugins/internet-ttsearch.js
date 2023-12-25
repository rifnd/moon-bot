let handler = async (m, {
  usedPrefix,
  command,
  args
}) => {
  try {
    if (!args[0]) return m.reply(Func.example(usedPrefix, command, 'nando.xyz'))
    m.react('🕐')
    let old = new Date()
    let json = await Func.fetchJson(API('alya', '/api/tiktok-post', { user: args[0] }, 'apikey'))
    if (!json.status) return m.reply(Func.jsonFormat(json))
    let ran = Math.floor(json.data.length * Math.random())
    let cap = `乂  *T T S E A R C H*\n\n`
    cap += `  ∘  *Author* : ${json.data[ran].author.nickname}\n`
    cap += `  ∘  *Views* : ${json.data[ran].play_count}\n`
    cap += `  ∘  *Like* : ${json.data[ran].digg_count}\n`
    cap += `  ∘  *Comment* : ${json.data[ran].comment_count}\n`
    cap += `  ∘  *Share* : ${json.data[ran].share_count}\n`
    cap += `  ∘  *Duration* : ${Func.timeFormat(json.data[ran].duration)}\n`
    cap += `  ∘  *Sound* : ${json.data[ran].music_info.title} - ${json.data[ran].music_info.author}\n`
    cap += `  ∘  *Caption* : ${json.data[ran].title}\n`
    cap += `  ◦  *Fetching* : ${(new Date() - old) * 1} ms\n\n`
    cap += global.set.footer
    conn.sendFile(m.chat, json.data[ran].play, '', cap, m)
  } catch (e) {
    console.log(e)
    m.reply(Func.jsonFormat(e))
  }
}
handler.help = handler.command = ['ttsearch']
handler.tags = ['internet']
handler.limit = true
module.exports = handler