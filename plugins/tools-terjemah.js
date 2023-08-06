let handler = async (m, {
    usedPrefix,
    command,
    text
}) => {
    if (!text) return m.reply(Func.example(usedPrefix, command, 'id Whats your name'))
    if (text && m.quoted && m.quoted.text) {
        let lang = text.slice(0, 2)
        try {
            let data = m.quoted.text
            let json = await Func.fetchJson(API('alya', '/api/translate', { text: data, iso: lang }, 'apikey'))
            m.reply(json.data.text)
        } catch (e) {
            console.log(e)
            m.reply(`Kode bahasa tidak didukung`)
        }
    } else if (text) {
        let lang = text.slice(0, 2)
        try {
            let data = text.substring(2).trim()
            let json = await Func.fetchJson(API('alya', '/api/translate', { text: data, iso: lang }, 'apikey'))
            m.reply(json.data.text)
        } catch (e) {
            console.log(e)
            m.reply(`Kode bahasa tidak didukung`)
        }
    }
}
handler.help = ["translate"].map((v) => v + " ")
handler.tags = ["tools"]
handler.command = /^(tr(anslate)?)$/i
handler.limit = true

module.exports = handler
