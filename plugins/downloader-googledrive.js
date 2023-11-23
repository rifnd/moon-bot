let handler = async (m, {
  usedPrefix,
  command,
  args
}) => {
  try {
    if (!args[0]) return m.reply(Func.example(usedPrefix, command, 'https://drive.google.com/file/d/1C6B2aUV781qZuycGLlErsa6YQ3QZHcJV/view?usp=drivesdk'))
    if (!args[0].match('drive.google.com')) return m.reply(status.invalid)
    m.react('🕒')
    const json = await Func.fetchJson(API('alya', '/api/gdrive', { url: args[0] }, 'apikey'))
    if (!json.status) return m.reply(Func.jsonFormat(json))
    let xSize = Func.sizeLimit(json.data.size, global.max_upload)
    if (xSize.oversize) return m.reply(`The file size (${json.data.size}) is too large, please download it yourself via this link : ${await (await Func.shortlink(json.data.url))}`)
    conn.sendMedia(m.chat, json.data.url, m, {
      fileName: json.data.filename,
      mentions: [m.sender]
    })
  } catch (e) {
    console.log(e)
    return m.reply(Func.jsonFormat(e))
  }
}
handler.help = handler.command = ['googledrive']
handler.tags = ['downloader']
handler.limit = true
module.exports = handler