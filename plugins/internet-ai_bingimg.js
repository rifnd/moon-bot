let handler = async (m, {
    usedPrefix,
    command,
    text
}) => {
    try {
        if (!text) return m.reply(Func.example(usedPrefix, command, 'Cat'))
        m.react('🕒')
        // how to get cookie? https://whatsapp.com/channel/0029VaIcU9uD38CXciEWEC2h
        const json = await Func.fetchJson(API('alya', '/api/bing-image', {
            q: text, cookie: global.cookieBing
        }, 'apikey'))
        if (!json.status) return m.reply(Func.jsonFormat(json))
        json.data.map((v, i) => {
            conn.sendFile(m.chat, v.url, '', '', m)
        })
    } catch (e) {
        console.log(e)
        return m.reply(status.error)
    }
}
handler.help = handler.command = ['bing-image']
handler.tags = ['internet']
handler.limit = handler.premium = true
module.exports = handler