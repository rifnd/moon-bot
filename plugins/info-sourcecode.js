let handler = async m => {
    teks = `
Name : Moon
Version : v1.1.1

Script : https://github.com/Nando35/mmon-bot
RestApi : https://api.alyachan.online`
    conn.sendMessageModify(m.chat, teks, m, {
        title: 'Moon - Bot',
        body: 'hi everybody',
        largeThumb: true,
        url: 'https://github.com/Nando35/moon-bot'
    })
}
handler.help = ['sourcecode']
handler.tags = ['info']
handler.command = /^(sc|sourcecode)$/i

module.exports = handler