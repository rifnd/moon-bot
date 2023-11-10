let handler = async(m, {
  usedPrefix,
  command,
  text
}) => {
  try {
    if (!text) return m.reply(Func.example(usedPrefix, command, '127.0.0.0'))
    m.react('🕒')
    const json = await Func.fetchJson(API('alya', '/api/ip', { q: text }, 'apikey'))
    if (!json.status) return m.reply(Func.jsonFormat(json))
    let cap = `乂  *I P C H E C K*\n\n`
    cap += `  ◦  *Country* : ` + json.data.country + `\n`
    cap += `  ◦  *Code* : ` + json.data.countryCode + `\n`
    cap += `  ◦  *Region* : ` + json.data.region + `\n`
    cap += `  ◦  *Region Name* : ` + json.data.regionName + `\n`
    cap += `  ◦  *City* : ` + json.data.city + `\n`
    cap += `  ◦  *Zip* : ` + json.data.zip + `\n`
    cap += `  ◦  *Lat* : ` + json.data.lat + `\n`
    cap += `  ◦  *Lon* : ` + json.data.lon + `\n`
    cap += `  ◦  *TimeZone* : ` + json.data.timezone + `\n`
    cap += `  ◦  *Isp* : ` + json.data.isp + `\n`
    cap += `  ◦  *Org* : ` + json.data.org + `\n`
    cap += `  ◦  *As* : ` + json.data.as + `\n\n`
    cap += global.set.footer
    m.reply(cap)
  } catch (e) {
    console.log(e)
    return m.reply(Func.jsonFormat(e))
  }
}
handler.command = handler.help = ['checkip']
handler.tags = ['tools']
handler.limit = true
module.exports = handler