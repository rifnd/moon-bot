let handler = async m => {
    teks = `
Name : ${require('../package.json').name}
Version : v${require('../package.json').version}

Repo : ${require('../package.json').homepage}
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