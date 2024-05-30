let handler = async (m, {
  usedPrefix,
  command,
  text
}) => {
  try {
    switch (command) {
      case 'chord': {
        if (!text) return m.reply(Func.example(usedPrefix, command, 'ALONE'))
        m.react('🕒')
        var json = await Func.fetchJson(API('alya', '/api/chord', { q: text }, 'apikey'))
        if (!json.status) return conn.reply(m.chat, Func.jsonFormat(json), m)
        if (json.data.length == 0) return m.reply(Func.texted('bold', '🚩 Chord not found.'))
        var sections = []
        json.data.map((v, i) => {
          sections.push({
            rows: [{
              title: `${v.title}`,
              //description: ``,
              id: `${usedPrefix}corget ${v.url}`
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

      case 'corget': {
        if (!text) return
        var json = await Func.fetchJson(API('alya', '/api/chordget', { url: text }, 'apikey'))
        if (!json.status) return conn.reply(m.chat, Func.jsonFormat(json), m)
        conn.reply(m.chat, json.data.chord, m)
      }
      break
    }
  } catch (e) {
    console.log(e)
    return m.reply(Func.jsonFormat(e))
  }
}
handler.help = ['chord'].map(v => v + ' ')
handler.tags = ['internet']
handler.command = /^(chord|corget)$/i
handler.limit = 1
module.exports = handler