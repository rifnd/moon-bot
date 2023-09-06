let handler = async (m, { usedPrefix, command }) => {
  try {
    if (command == "cnnnews") {
      let json = await Func.fetchJson(API('alya', '/api/cnn', 'apikey'))
      let teks = `CNN News\n\n`;
      json.data.map((v, i) => {
        if (i < 10) {
          teks += "*" + (i + 1) + "*. " + v.berita + "\n";
          teks += `   ${tn}  *Url* : ` + v.berita_url + "\n\n";
        }
      });
      conn.sendMessageModify(m.chat, teks + nma, m, {
        largeThumb: true
      });
    }
    if (command == "tribunnews") {
      let json = await Func.fetchJson(API('alya', '/api/tribun', 'apikey'))
      let teks = `Tribun News\n\n`;
      json.data.map((v, i) => {
        if (i < 10) {
          teks += "*" + (i + 1) + "*. " + v.title + "\n";
          teks += `   ${tn}  *Time* : ` + v.time + `\n`;
          teks += `   ${tn}  *Url* : ` + v.link + "\n";
          teks += `   ${tn}  *Description* : ` + v.description + `\n\n`;
        }
      });
      conn.sendMessageModify(m.chat, teks + nma, m, {
        largeThumb: true,
      });
    }
    if (command == "kompasnews") {
      let json = await Func.fetchJson(API('alya', '/api/kompas', 'apikey'))
      let teks = `Kompas News\n\n`;
      json.data.map((v, i) => {
        if (i < 10) {
          teks += "*" + (i + 1) + "*. " + v.title + "\n";
          teks += `   ${tn}  *Time* : ` + v.time + `\n`;
          teks += `   ${tn}  *Url* : ` + v.link + "\n\n";
        }
      });
      conn.sendMessageModify(m.chat, teks + nma, m, {
        largeThumb: true,
      });
    }
    if (command == "inews") {
      let json = await Func.fetchJson(API('alya', '/api/inews', 'apikey'))
      let teks = `Inews\n\n`;
      json.data.map((v, i) => {
        if (i < 10) {
          teks += "*" + (i + 1) + "*. " + v.berita + "\n";
          teks += `   ${tn}  *Time* : ` + v.berita_diupload + `\n`;
          teks += `   ${tn}  *Category* : ` + v.berita_jenis + `\n`;
          teks += `   ${tn}  *Url* : ` + v.berita_url + "\n\n";
        }
      });
      conn.reply(m.chat, teks + set.footer, m);
    }
  } catch (e) {
    return console.log(String(e));
    return m.reply(status.fail);
  }
};
handler.help = handler.command = ["cnnnews", "tribunnews", "kompasnews", "inews"];
handler.tags = ["internet"];
handler.limit = true;
module.exports = handler;