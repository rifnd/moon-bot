let handler = async (m, {
  usedPrefix,
  command,
  text
}) => {
  try {
    switch (command) {
      case 'lyrics':
      case 'lirik':
      case 'lyric': {
        if (!text) return m.reply(Func.example(usedPrefix, command, 'ALONE'))
        m.react('🕒')
        var json = await Func.fetchJson(API('alya', '/api/lirik2', { q: text }, 'apikey'))
        if (!json.status) return conn.reply(m.chat, Func.jsonFormat(json), m)
        if (json.data.length == 0) return m.reply(Func.texted('bold', '🚩 Lyric not found.'))
        var sections = []
        json.data.map((v, i) => {
          sections.push({
            rows: [{
              title: `${v.result.full_title}`,
              description: `[ Artist : ${v.result.artist_names} | Release : ${v.result.release_date_for_display} ]`,
              id: `${usedPrefix}lirget ${v.result.relationships_index_url}`
            }]
          })
        })
        const buttons = [{
          name: 'single_select',
          buttonParamsJson: JSON.stringify({
            title: 'Tap Here!',
            sections
          })
        }]
        await conn.sendAIMessage(m.chat, buttons, m, {
          header: ``,
          content: `Here are the search results for "${text}"`,
          footer: global.set.footer
        })
      }
      break

      case 'lirget': {
        if (!text) return
        var json = await Func.fetchJson(API('alya', '/api/lirikget2', { url: text }, 'apikey'))
        if (!json.status) return conn.reply(m.chat, Func.jsonFormat(json), m)
        conn.reply(m.chat, json.data.lirik, m)
      }
      break
    }
  } catch (e) {
    console.log(e)
    return m.reply(Func.jsonFormat(e))
  }
}
handler.help = ['lyrics']
handler.tags = ['internet']
handler.command = ['lirik', 'lyric', 'lyrics', 'lirget']
handler.limit = true
module.exports = handler