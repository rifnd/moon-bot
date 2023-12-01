let handler = async (m, {
  usedPrefix,
  command,
  args,
  text
}) => {
  try {
    if (!args[0]) return m.reply(`Send the YouTube link you want to download the lyrics from\n\nExample : ${usedPrefix + command} https://youtube.com/shorts/OdScS_uN2jc?si=PpjVEwvaQ1BYCV5e`)
    if (!/^(?:https?:\/\/)?(?:www\.|m\.|music\.)?youtu\.?be(?:\.com)?\/?.*(?:watch|embed)?(?:.*v=|v\/|\/)([\w\-_]+)\&?/.test(args[0])) return m.reply(env.status.invalid)
    m.react('🕒')
    const json = await Func.fetchJson(API('alya', '/api/transcribe', { url: args[0] }, 'apikey'))
    if (!json.status) return m.reply(Func.jsonFormat(json))
    let res = json.data.map(v => v.f).join(' ')
    m.reply(res)
  } catch (e) {
    console.log(e)
    return m.reply(Func.jsonFormat(e))
  }
}
handler.help = handler.command = ['transcibe']
handler.tags = ['tools']
handler.limit = true
module.exports = handler