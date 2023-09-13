let handler = async (m, {
    usedPrefix,
    command,
    text
}) => {
    if (!text) return m.reply(Func.example(usedPrefix, command, 'id apakah lu bahagia?'))
    if (text && m.quoted && m.quoted.text) {
        let lang = text.slice(0, 2)
        try {
            let data = m.quoted.text
            let json = await Func.fetchJson(API('alya', '/api/paraphraser', { q: data, lang: lang }, 'apikey'))
            if (!json.status) return m.reply(Func.jsonFormat(json))
            m.reply(json.data.word)
        } catch (e) {
            console.log(e)
        }
    } else if (text) {
        let lang = text.slice(0, 2)
        try {
            let data = text.substring(2).trim()
            let json = await Func.fetchJson(API('alya', '/api/paraphraser', { q: data, lang: lang }, 'apikey'))
            if (!json.status) return m.reply(Func.jsonFormat(json))
            m.reply(json.data.word)
        } catch (e) {
            console.log(e)
        }
    }
}
handler.help = handler.command = ['paraphraser']
handler.tags = ['tools']
handler.limit = true
module.exports = handler