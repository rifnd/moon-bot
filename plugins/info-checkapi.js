let handler = async(m, {
    usedPrefix,
    command,
    text
}) => {
    try {
        const json = await Func.fetchJson(API('alya', '/api/check-key', {}, 'apikey'))
        m.reply(Func.jsonFormat(json))
    } catch (e) {
        console.log(e)
        return m.reply(Func.jsonFormat(e))
    }
}
handler.help = handler.command = ['checkapi']
handler.tags = ['info']
module.exports = handler