const axios = require('axios')
const fs = require('fs')
let handler = async (m, {
  conn,
  text
}) => {
  try {
    var who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender
    var pp = await conn.profilePictureUrl(who, 'image')
  } catch (e) {
    var pp = 'https://telegra.ph/file/32ffb10285e5482b19d89.jpg'
  } finally {
    let username = conn.getName(who)
    if (!text) return m.reply('Where is the text?.')
    m.react('🕐')
    const json = {
      "type": "quote",
      "format": "png",
      "backgroundColor": "#1c1b1b",
      "width": 512,
      "height": 768,
      "scale": 2,
      "messages": [{
        "entities": [],
        "avatar": true,
        "from": {
          "id": 1,
          "name": username,
          "photo": {
            "url": pp
          }
        },
        "text": text,
        "replyMessage": {}
      }]
    }
    const response = axios.post('https://bot.lyo.su/quote/generate', json, {
      headers: { 'Content-Type': 'application/json' }
    }).then(res => {
      const buffer = Buffer.from(res.data.result.image, 'base64')
      conn.sendSticker(m.chat, buffer, m, {
        packname: global.set.packname,
        author: global.set.author
      })
    })
  }
}
handler.help = ['qc']
handler.tags = ['sticker']
handler.command = /^(qc|quickchat)$/i
handler.limit = true
module.exports = handler