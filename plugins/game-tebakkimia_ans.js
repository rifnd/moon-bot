const similarity = require('similarity')
const threshold = 0.72
let handler = m => m
handler.before = async function (m, {
    conn,
    users
}) {
    let id = m.chat
    conn.tebakkimia = conn.tebakkimia ? conn.tebakkimia : {}
    if (m.quoted && /teki untuk bantuan/i.test(m.quoted.text) && !m.fromMe) {
        if (!(id in conn.tebakkimia) && /teki untuk bantuan/i.test(m.quoted.text)) return m.reply('Soal itu telah berakhir')
        if (m.quoted.id == conn.tebakkimia[id][0].id) {
            if (['Timeout', ''].includes(m.text)) return !0
            let json = JSON.parse(JSON.stringify(conn.tebakkimia[id][1]))
            if (m.text.toLowerCase() == json.unsur.toLowerCase().trim()) {
                await m.reply(`*Benar*, *+ ${Func.formatNumber(conn.tebakkimia[id][2])} Exp*`).then(() => {
                    users.exp += conn.tebakkimia[id][2]
                    clearTimeout(conn.tebakkimia[id][3])
                    delete conn.tebakkimia[id]
                })
            } else if (similarity(m.text.toLowerCase(), json.unsur.toLowerCase().trim()) >= threshold) m.reply(`*Dikit Lagi!*`)
            else m.reply(`*Salah!*`)
        }
    }
    return !0
}
handler.exp = 0
module.exports = handler
