let handler = async (m, {
    usedPrefix,
    command,
    args
}) => {
    if (!args[0]) return m.reply(Func.example(usedPrefix, command, 'https://www.mediafire.com/file/c8aod99ns240d4t/com.termux_118.apk/file'))
    if (!args[0].match('mediafire.com')) return m.reply(status.invalid)
    m.reply(status.wait)
    try {
        const json = await Func.fetchJson(API('alya', '/api/mediafire', { url: args[0] }, 'apikey'))
        if (!json.status) return m.reply(Func.jsonFormat(json))
        let ca = `❏  *M E D I A F I R E*\n\n`
        ca += ` ›  *Name* : ` + json.data.filename + '\n'
        ca += ` ›  *Size* : ` + json.data.filesize + '\n'
        ca += ` ›  *Type* : ` + json.data.filetype + '\n'
        ca += ` ›  *Mime* : ` + json.data.mimetype + '\n'
        ca += ` ›  *Upload* : ` + json.data.uploadAt + '\n\n'
        ca += global.set.footer
        let xSize = Func.sizeLimit(json.data.filesize, global.set.max_upload)
        if (xSize.oversize) return m.reply(`Ukuran file (${json.data.filesize}) terlalu besar, silahkan download sendiri lewat link ini : ${await (await Func.shortlink(json.data.link))}`)
        conn.sendMessageModify(m.chat, ca, m, {
            largeThumb: true,
            thumbnail: 'https://telegra.ph/file/98417f85e45f3cae84bee.jpg'
        }).then(async () => {
          conn.sendMedia(m.chat, json.data.link, m, {
            filename: json.data.filename,
            mentions: [m.sender]
          })
        })
    } catch (e) {
        console.log(e)
        return m.reply(status.error)
    }
}
handler.help = handler.command = ['mediafire']
handler.tags = ['downloader']
handler.limit = 1
module.exports = handler