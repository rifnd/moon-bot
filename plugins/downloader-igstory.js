let handler = async (m, {
    usedPrefix,
    command,
    args
}) => {
    if (!args[0]) return m.reply(Func.example(usedPrefix, command, 'bulansutena'))
    m.reply(status.wait)
    try {
        const json = await Func.fetchJson(API('alya', '/api/igs2', { q: args[0] }, 'apikey'))
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
handler.help = ['igstory']
handler.tags = ['downloader']
handler.command = /^(igs|igstory|instagramstory)$/i
handler.limit = 1

module.exports = handler
