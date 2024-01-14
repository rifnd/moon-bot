let handler = async(m, {
  conn,
  usedPrefix,
  command,
  text
}) => {
  try {
    if (!text) return m.reply(Func.example(usedPrefix, command, 'jnt | JX1710180625'))
    let [ku, rir] = text.split` | `
    m.react('🕒')
    const json = await Func.fetchJson(API('alya', '/api/checkresi', { kurir: ku, resi: rir }, 'apikey'))
    if (!json.status) return m.reply(Func.jsonFormat(json))
    m.reply(Func.jsonFormat(e))
  } catch (e) {
    console.log(e)
    return m.reply(Func.jsonFormat(e))
  }
}
handler.help = ['cekresi'].map(v => v + '')
handler.tags = ['tools']
handler.command = /^(cekresi)$/i
handler.limit = true
module.exports = handler