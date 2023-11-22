let handler = async (m, {
  usedPrefix,
  command
}) => {
  try {
    if (command == 'cnnnews') {
      let json = await Func.fetchJson(API('alya', '/api/cnn', {}, 'apikey'))
      let teks = `CNN News\n\n`
      json.data.map((v, i) => {
        if (i < 10) {
          teks += '*' + (i + 1) + '*. ' + v.berita + '\n'
          teks += `  ◦  *Url* : ` + v.berita_url + '\n\n'
        }
      })
      conn.sendMessageModify(m.chat, teks, m, {
        thumbnailUrl: json.data[0].thumb,
      })
    }
    if (command == 'tribunnews') {
      let json = await Func.fetchJson(API('alya', '/api/tribun', {}, 'apikey'))
      let teks = `Tribun News\n\n`
      json.data.map((v, i) => {
        if (i < 10) {
          teks += '*' + (i + 1) + '*. ' + v.title + '\n'
          teks += `  ◦  *Time* : ` + v.time + `\n`
          teks += `  ◦  *Url* : ` + v.link + '\n'
          teks += `  ◦  *Description* : ` + v.description + `\n\n`
        }
      })
      conn.sendMessageModify(m.chat, teks, m, {
        thumbnailUrl: json.data[0].image_full,
      })
    }
    if (command == 'kompasnews') {
      let json = await Func.fetchJson(API('alya', '/api/kompas', {}, 'apikey'))
      let teks = `Kompas News\n\n`
      json.data.map((v, i) => {
        if (i < 10) {
          teks += '*' + (i + 1) + '*. ' + v.title + '\n'
          teks += `  ◦  *Time* : ` + v.time + `\n`
          teks += `  ◦  *Url* : ` + v.link + '\n\n'
        }
      })
      conn.sendMessageModify(m.chat, teks, m, {
        thumbnailUrl: json.data[0].image_full,
      })
    }
    if (command == 'inews') {
      let json = await Func.fetchJson(API('alya', '/api/inews', {}, 'apikey'))
      let teks = `Inews\n\n`
      json.data.map((v, i) => {
        if (i < 10) {
          teks += '*' + (i + 1) + '*. ' + v.berita + '\n'
          teks += `  ◦  *Time* : ` + v.berita_diupload + `\n`
          teks += `  ◦  *Category* : ` + v.berita_jenis + `\n`
          teks += `  ◦  *Url* : ` + v.berita_url + '\n\n'
        }
      })
      conn.reply(m.chat, teks, m)
    }
  } catch (e) {
    console.log(String(e))
    return m.reply(Func.jsonFormat(e))
  }
}
handler.help = ['cnnnews', 'tribunnews', 'kompasnews', 'inews']
handler.tags = ['internet']
handler.command = /^(cnnnews|tribunnews|kompasnews|inews)?$/i
handler.limit = true
module.exports = handler