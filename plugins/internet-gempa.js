let handler = async (m, {
  usedPrefix,
  command,
  args
}) => {
  try {
    const json = await Func.fetchJson(API('alya', '/api/gempa', {}, 'apikey'))
    if (!json.status) return m.reply(Func.jsonFormat(json))
    m.react('🕒')
    let teks = `乂  *G E M P A*\n\n`
    teks += `  ◦  *Waktu* : ${json.data.waktu}\n`
    teks += `  ◦  *Besarnya* : ${json.data.magnitude}\n`
    teks += `  ◦  *Koordinat* : ${json.data.koordinat}\n`
    teks += `  ◦  *Lintang* : ${json.data.lokasi}\n`
    teks += `  ◦  *Lokasi* : ${json.data.dirasakan}\n\n`
    teks += global.set.footer
    conn.sendFile(m.chat, json.data.thumbnail, '', teks, m)
  } catch (e) {
    console.log(e)
    return m.reply(Func.jsonFormat(e))
  }
}
handler.help = handler.command = ['gempa']
handler.tags = ['internet']
handler.limit = 1
module.exports = handler