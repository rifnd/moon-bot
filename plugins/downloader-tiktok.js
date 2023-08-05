let handler = async (m, {
    usedPrefix,
    command,
    args
}) => {
    if (!args[0]) return m.reply(Func.example(usedPrefix, command, 'https://www.tiktok.com/@yahh_016/video/7260960038582258950?is_from_webapp=1&sender_device=pc'))
    if (!args[0].match('tiktok.com')) return m.reply(status.invalid)
    m.reply(status.wait)
    try {
        const json = await Func.fetchJson(API('alya', '/api/tiktok', {
            url: args[0]
        }, 'apikey'))
        if (!json.status) return m.reply(Func.jsonFormat(json))
        if (command == 'tiktok' || command == 'tt') {
            if (json.duration === 0) {
                let res = await Func.fetchJson(API('alya', '/api/ttslide', {
                    url: args[0]
                }, 'apikey'))
                if (!res.status) return m.reply(Func.jsonFormat(re))
                res.data.map(v => conn.sendFile(m.chat, v.url, '', json.title, m))
            }
            if (json.data.video_nowm) return conn.sendFile(m.chat, json.data.video_nowm, json.title, m)
        } else if (command == 'ttwm' || command == 'tikwm') {
            conn.sendFile(m.chat, json.data.video_wm, json.title, m)
        } else if (command == 'ttaudio' || command == 'tikmp3') {
            conn.sendFile(m.chat, json.data.music, '', '', m)
        }
    } catch {
        console.log(e)
        return m.reply(status.error)
    }
}
handler.help = ['tiktok', 'tikwm', 'tikmp3'].map(v => v + ' <url>')
handler.tags = ['downloader']
handler.command = /^(tt|tiktok|ttwm|tikwm|ttaudio|tikmp3)$/i
handler.limit = 1

module.exports = handler