let handler = async (m, {
    usedPrefix,
    command,
    args
}) => {
    if (!args[0]) return m.reply(Func.example(usedPrefix, command, 'https://twitter.com/jokowi/status/1687008875864846336?s=20'))
    if (!args[0].match('twitter.com')) return m.reply(status.invalid)
    m.reply(status.wait)
    try {
        const json = await Func.fetchJson(API('alya', '/api/twitter', { url: args[0] }, 'apikey'))
        if (!json.status) return m.reply(Func.jsonFormat(json))
        for (let v of json.data) {
            conn.sendMedia(m.chat, v.url, m, {
              caption: global.set.wm,
              mentions: [m.sender]
            })
        }
    } catch (e) {
        console.log(e)
        return m.reply(status.error)
    }
}
handler.help = ['twitter']
handler.tags = ['downloader']
handler.command = /^(twitter)$/i
handler.limit = 1

module.exports = handler