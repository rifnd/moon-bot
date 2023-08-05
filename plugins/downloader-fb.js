let handler = async (m, {
    usedPrefix,
    command,
    args
}) => {
    if (!args[0]) return m.reply(Func.example(usedPrefix, command, 'https://fb.watch/mdAicxI4P9/'))
    if (!args[0].match(/(?:https?:\/\/(web\.|www\.|m\.)?(facebook|fb)\.(com|watch)\S+)?$/)) return m.reply(status.invalid)
    m.reply(status.wait)
    try {
        const json = await Func.fetchJson(API('alya', '/api/fb', { url: args[0] }, 'apikey'))
        if (!json.status) return m.reply(Func.jsonFormat(json))
        let result = json.data.find(v => v.quality == 'HD' && v.response == 200)
        if (result) {
            conn.sendFile(m.chat, result.url, '', 'Kualitas HD', m)
        } else {
            let result = json.data.find(v => v.quality == 'SD' && v.response == 200)
            if (!result) return m.reply(status.fail)
            conn.sendFile(m.chat, result.url, '', 'Kualitas SD', m)
        }
    } catch (e) {
        console.log(e)
        return m.reply(status.error)
    }
}
handler.help = ['facebook'].map(v => v + ' <url>')
handler.tags = ['downloader']
handler.command = /^(fb|facebook)$/i
handler.limit = 1

module.exports = handler 
