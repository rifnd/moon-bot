let handler = async (m, {
    usedPrefix,
    command,
    text
}) => {
    if (!text) return m.reply(Func.example(usedPrefix, command, 'Penemu listrik'))
    m.reply(status.wait)
    try {
        const json = await Func.fetchJson(API('alya', '/api/brainly', { questions: text }, 'apikey'))
        if (!json.status) return m.reply(Func.jsonFormat(json))
        let teks = `*BRAINLY*\n\n`
        json.data.map((v, i) => {
            teks += `*${(i + 1)}*. ${v.question}\n`
            teks += `›  *Jawaban* : \n${v.answers}\n\n`
        })
        m.reply(teks + global.set.footer)
    } catch {
        console.log(e)
        return m.reply(status.error)
    }
}
handler.help = handler.command = ['brainly']
handler.tags = ['internet']
handler.limit = 1

module.exports = handler
