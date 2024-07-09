let handler = async (m, {
    usedPrefix,
    command,
    text
}) => {
    try {
        if (!text) return m.reply(Func.example(usedPrefix, command, 'galau'))
        m.react('🕛')
        const json = await Func.fetchJson(API('alya', '/api/storywa', { q: text }, 'apikey'))
        if (!json.status) return m.reply(Func.jsonFormat(json))
        for (let i = 0; i < 5; i++) {
            let ran = Math.floor(json.data.length * Math.random())
            let tek = `–  *S T O R Y - W A*\n\n`
            tek += `  ∘  *ID* : ${json.data[ran].id}\n`
            tek += `  ∘  *Title* : ${json.data[ran].title}\n`
            tek += `  ∘  *Download* : ${json.data[ran].download}\n\n`
            tek += global.set.footer
            conn.sendFile(m.chat, json.data[ran].video_url, '', tek, m)
            await Func.delay(3000)
        }
    } catch (e) {
        console.log(e)
        m.reply(Func.jsonFormat(e))
    }
}
handler.help = handler.command = ['storywa']
handler.tags = ['internet']
handler.limit = true
module.exports = handler