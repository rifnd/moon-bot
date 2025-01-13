let handler = async (m, {
   conn,
   usedPrefix,
   command,
   text,
   Func
}) => {
   try {
      if (command == 'cuaca') {
         if (!text) return conn.reply(m.chat, Func.example(usedPrefix, command, 'Porong'), m)
         m.react('🕒')
         let json = await Api.get('api/cuaca', {
            q: text
         })
         if (!json.status) return conn.reply(m.chat, Func.jsonFormat(json), m)
         let sections = []
         json.data.map((v, i) => {
            sections.push({
               rows: [{
                  title: `${i + 1}. ${v.kotkab} - ${v.provinsi}`,
                  description: `Kec. ${v.kecamatan} - Ds. ${v.desa}`,
                  id: `${usedPrefix}cuaca-get ${v.lon} ${v.lat}`
               }]
            })
         })
         conn.sendButton(m.chat, [{
            name: 'single_select',
            param: {
               title: 'Tap Here!',
               sections
            }
         }], m, {
            text: `The following is the result of searching for weather in the *${text}* region.`,
            footer: global.footer,
         })
      } else if (command == 'cuaca-get') {
         if (!text) return
         m.react('🕒')
         let [lon, lat] = text.split(' ')
         let json = await Api.get('api/cuaca-get', {
            longitude: lon, latitude: lat
         })
         let teks = `乂  *W E A T H E R*\n\n`
         teks += `   ◦  *Weather* : ${json.data.cuaca.weather_desc} - ${json.data.cuaca.weather_desc_en}\n`
         teks += `   ◦  *Province* : ${json.data.lokasi.provinsi}\n`
         teks += `   ◦  *Region* : Ds. ${json.data.lokasi.desa} - Kec. ${json.data.lokasi.kecamatan} - City/District. ${json.data.lokasi.kotkab}\n`
         teks += `   ◦  *Longitude* : ${json.data.lokasi.lon}\n`
         teks += `   ◦  *Latitude* : ${json.data.lokasi.lat}\n`
         teks += `   ◦  *Time* : ${json.data.cuaca.local_datetime}\n\n`
         teks += global.footer
         conn.reply(m.chat, teks, m)
      }
   } catch (e) {
      return conn.reply(m.chat, Func.jsonFormat(e), m)
   }
}
handler.help = ['cuaca']
handler.command = ['cuaca-get']
handler.use = 'area'
handler.tags = ['internet']
handler.limit = true
module.exports = handler