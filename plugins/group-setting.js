let handler = async (m, { 
    conn, 
    args, 
    usedPrefix, 
    command
}) => {
    let isClose = { // Switch Case Like :v
        'open': 'not_announcement',
        'close': 'announcement',
    }[(args[0] || '')]
    if (isClose === undefined) return m.reply(`Wrong format!!\n\nExample :\n${usedPrefix + command} close\n${usedPrefix + command} open`)
    await conn.groupSettingUpdate(m.chat, isClose)
}
handler.help = ['group']
handler.tags = ['group']
handler.command = ['group', 'gcsetting']
handler.admin = true
handler.botAdmin = true
module.exports = handler