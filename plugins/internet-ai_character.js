let handler = async (m, {
  usedPrefix,
  command,
  text
}) => {
  try {
    if (command == 'cai') {
      if (!text) return m.reply(Func.example(usedPrefix, command, 'Halo perkenalkan dirimu'))
      m.react('🕒')
      if (!db.data.chara) return conn.reply(m.chat, Func.texted('bold', `Not found character_id.`), m)
      let json = await Func.fetchJson(API('alya', '/api/cai-chat', { character_id: db.data.chara, message: text }, 'apikey'))
      if (!json.status) return m.reply(Func.jsonFormat(json))
      m.reply(json.data.content)
    } else if (command == 'set-cai') {
      if (!text) return m.reply(Func.example(usedPrefix, command, 'B0608QM8HK6/liya'))
      m.react('🕒')
      db.data.chara = text
      conn.reply(m.chat, Func.texted('bold', `Sucessfully set character_id : ${text}.`), m)
    } else if (command == 'cai-create') {
      if (!text) return m.reply(Func.example(usedPrefix, command, 'mikai'))
      let q = m.quoted ? m.quoted : m
      let mime = (q.msg || q).mimetype || ''
      if (!/image\/(jpe?g|png)/.test(mime)) return m.reply(`Kirim atau balas gambar untuk dijadikan profile character dengan perintah ${usedPrefix + command} your name character`)
      m.react('🕒')
      let img = await q.download()
      let res = await scrap.uploader(img)
      let json = await Func.fetchJson(API('alya', '/api/cai-create', { name: text, gender: 'female', profile: res.data.url }, 'apikey'))
      if (json.msg == "System cannot detect JSON!") {
        json = await Func.fetchJson(API('alya', '/api/cai-create', { name: text, gender: 'female', profile: res.data.url }, 'apikey'))
      }
      if (!json.status) return m.reply(Func.jsonFormat(json))
      if (json.data.name && json.data.character_id) {
        conn.reply(m.chat, Func.texted('bold', `✅ Done, Successfully created character ${json.data.name} character_id : ${json.data.character_id}`), m)
      } else {
        conn.reply(m.chat, Func.texted('bold', `Failed to fetch the data character, try again in 5 seconds.`), m)
      }
    }
  } catch (e) {
    console.log(e)
    m.reply(Func.jsonFormat(e))
  }
}
handler.help = handler.command = ['cai', 'cai-create', 'set-cai']
handler.tags = ['internet']
handler.limit = true
module.exports = handler