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
    teks += `  ◦  *Date* : ${json.data.tanggal}\n`
    teks += `  ◦  *At* : ${json.data.jam}\n`
    teks += `  ◦  *Magnitude* : ${json.data.Magnitude}\n`
    teks += `  ◦  *Coordinate* : ${json.data.Coordinates}\n`
    teks += `  ◦  *Latitude* : ${json.data.Lintang}\n`
    teks += `  ◦  *Longitude* : ${json.data.Bujur}\n`
    teks += `  ◦  *Depth* : ${json.data.Kedalaman}\n`
    teks += `  ◦  *Region* : ${json.data.Wilayah}\n`
    teks += `  ◦  *Potential* : ${json.data.Potensi}\n`
    teks += `  ◦  *Sensed* : ${json.data.Dirasakan}\n`
    teks += global.set.footer
    conn.sendFile(m.chat, json.data.Shakemap, '', teks, m)
  } catch (e) {
    console.log(e)
    return m.reply(Func.jsonFormat(e))
  }
}
handler.help = ['gempa']
handler.tags = ['internet']
handler.command = /^(gempa|earthquake)$/i
handler.limit = 1
module.exports = handler