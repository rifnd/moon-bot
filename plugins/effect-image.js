const uploadFile = require('../lib/uploadFile')
const uploadImage = require('../lib/uploadImage')
let handler = async (m, {
  usedPrefix,
  command
}) => {
  let q = m.quoted ? m.quoted : m
  let mime = (q.msg || q).mimetype || ''
  if (!mime) return m.reply(Func.texted('bold', `Kirim/reply foto dengan perintah ${usedPrefix + command}`))
  m.reply(status.wait)
  let media = await q.download();
  let isTele = /image\/(png|jpe?g|gif)/.test(mime);
  let link = await (isTele ? uploadImage : uploadFile)(media)
  try {
    if (command == 'jail') {
      let json = await scrap.imgeffect('jail', link)
      conn.sendFile(m.chat, json, 'jail.jpg', wm, m)
    }
    if (command == 'blur') {
      let json = await scrap.imgeffect('blur', link)
      conn.sendFile(m.chat, json, 'blur.jpg', wm, m)
    }
    if (command == 'invert') {
      let json = await scrap.imgeffect('invert', link)
      conn.sendFile(m.chat, json, 'invert.jpg', wm, m)
    }
    if (command == 'sepia') {
      let json = await scrap.imgeffect('sepia', link)
      conn.sendFile(m.chat, json, 'sepia.jpg', wm, m)
    }
    if (command == 'wasted') {
      let json = await scrap.imgeffect('wasted', link)
      conn.sendFile(m.chat, json, 'wasted.jpg', wm, m)
    }
    if (command == 'wanted') {
      let json = await scrap.imgeffect('wanted', link)
      conn.sendFile(m.chat, json, 'wanted.jpg', wm, m)
    }
    if (command == 'grayscale') {
      let json = await scrap.imgeffect('grayscale', link)
      conn.sendFile(m.chat, json, 'grayscale.jpg', wm, m)
    }
    if (command == '300years') {
      let json = await scrap.imgeffect('300years', link)
      conn.sendFile(m.chat, json, '300years.jpg', wm, m)
    }
    if (command == 'afusion') {
      let json = await scrap.imgeffect('afusion', link)
      conn.sendFile(m.chat, json, 'afusion.jpg', wm, m)
    }
    if (command == 'approved') {
      let json = await scrap.imgeffect('approved', link)
      conn.sendFile(m.chat, json, 'approved.jpg', wm, m)
    }
    if (command == 'badge') {
      let json = await scrap.imgeffect('badge', link)
      conn.sendFile(m.chat, json, 'badge.jpg', wm, m)
    }
    if (command == 'badslap') {
      let json = await scrap.imgeffect('badslap', link)
      conn.sendFile(m.chat, json, 'badslap.jpg', wm, m)
    }
    if (command == 'beautiful') {
      let json = await scrap.imgeffect('beautiful', link)
      conn.sendFile(m.chat, json, 'beautiful.jpg', wm, m)
    }
    if (command == 'blurple') {
      let json = await scrap.imgeffect('blurple', link)
      conn.sendFile(m.chat, json, 'blurple.jpg', wm, m)
    }
    if (command == 'brazzers') {
      let json = await scrap.imgeffect('brazzers', link)
      conn.sendFile(m.chat, json, 'brazzers.jpg', wm, m)
    }
    if (command == 'burn') {
      let json = await scrap.imgeffect('burn', link)
      conn.sendFile(m.chat, json, 'burn.jpg', wm, m)
    }
    if (command == 'circle') {
      let json = await scrap.imgeffect('circle', link)
      conn.sendFile(m.chat, json, 'circle.jpg', wm, m)
    }
    if (command == 'crush') {
      let json = await scrap.imgeffect('crush', link)
      conn.sendFile(m.chat, json, 'crush.jpg', wm, m)
    }
    if (command == 'deepfry') {
      let json = await scrap.imgeffect('deepfry', link)
      conn.sendFile(m.chat, json, 'deepfry.jpg', wm, m)
    }
  } catch (e) {
    console.log(e)
    return m.reply(Func.jsonFormat(e))
  }
}
handler.help = handler.command = ['jail', 'blur', 'invert', 'sepia', 'wasted', 'wanted', 'grayscale', '300years', 'afusion', 'approved', 'badge', 'badslap', 'beautiful', 'blurple', 'brazzers', 'burn', 'circle', 'crush', 'deepfry']
handler.tags = ['effect']
handler.limit = 1

module.exports = handler
