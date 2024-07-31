const { Converter } = new (require('@moonr/func'))
const { readFileSync: read, unlinkSync: remove, writeFileSync: create } = require('fs')
const path = require('path')
const { exec } = require('child_process')
const { tmpdir } = require('os')
module.exports = {
   run: async (m, {
      conn,
      command,
      Func
   }) => {
      try {
         if (m.quoted && typeof m.quoted.buttons != 'undefined' && typeof m.quoted.videoMessage != 'undefined') {
            m.react('🕒')
            const media = await conn.saveMediaMessage(m.quoted.videoMessage)
            const result = Func.filename('mp3')
            exec(`ffmpeg -i ${media} ${result}`, async (err, stderr, stdout) => {
               remove(media)
               if (err) return conn.reply(m.chat, Func.texted('bold', `🚩 Conversion failed.`), m)
               let buff = read(result)
               if (/tomp3|toaudio/.test(command)) return conn.sendFile(m.chat, buff, 'audio.mp3', '', m).then(() => {
                  remove(result)
               })
               if (/tovn/.test(command)) return conn.sendFile(m.chat, buff, 'audio.mp3', '', m, {
                  ptt: true
               }).then(() => {
                  remove(result)
               })
            })
         } else {
            let q = m.quoted ? m.quoted : m
            let mime = ((m.quoted ? m.quoted : m.msg).mimetype || '')
            if (/ogg/.test(mime)) {
               m.react('🕒')
               let buffer = await q.download()
               const media = path.join(tmpdir(), Func.filename('mp3'))
               let save = create(media, buffer)
               const result = Func.filename('mp3')
               exec(`ffmpeg -i ${media} ${result}`, async (err, stderr, stdout) => {
                  remove(media)
                  if (err) return conn.reply(m.chat, Func.texted('bold', `🚩 Conversion failed.`), m)
                  let buff = read(result)
                  if (/tomp3|toaudio/.test(command)) return conn.sendFile(m.chat, buff, 'audio.mp3', '', m).then(() => {
                     remove(result)
                  })
                  if (/tovn/.test(command)) return conn.sendFile(m.chat, buff, 'audio.mp3', '', m, {
                     ptt: true
                  }).then(() => {
                     remove(result)
                  })
               })
            } else if (/audio|video/.test(mime)) {
               m.react('🕒')
               const buff = await Converter.toAudio(await q.download(), 'mp3')
               if (/tomp3|toaudio/.test(command)) return conn.sendFile(m.chat, buff, 'audio.mp3', '', m)
               if (/tovn/.test(command)) return conn.sendFile(m.chat, buff, 'audio.mp3', '', m, {
                  ptt: true
               })
            } else {
               conn.reply(m.chat, Func.texted('bold', `🚩 This feature only for audio / video.`), m)
            }
         }
      } catch (e) {
         return conn.reply(m.chat, Func.jsonFormat(e), m)
      }
   },
   help: ['tomp3', 'tovn'],
   use: 'reply media',
   tags: ['converter'],
   command: /^(to?(mp3|vn))$/i,
   limit: true
}