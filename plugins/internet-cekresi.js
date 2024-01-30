let handler = async (m, {
  usedPrefix,
  command,
  text
}) => {
  try {
    if (!text) return m.reply(`Masukan nomor resi dan nama kurir\n\nContoh : ${usedPrefix + command} jnt | JX1710180625`)
    let [ku, rir] = text.split` | `
    m.react('🕒')
    const json = await Func.fetchJson(API('alya', '/api/checkresi', { kurir: `${ku}`, resi: `${rir}` }, 'apikey'))
    if (!json.status) return m.reply(Func.jsonFormat(json))
    m.reply(Func.jsonFormat(json))
  } catch (e) {
    console.log(e)
    return m.reply(Func.jsonFormat(e))
  }
}
handler.help = handler.command = ['cekresi']
handler.tags = ['internet']
handler.limit = true
module.exports = handler