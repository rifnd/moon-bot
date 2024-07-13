let handler = async (m, {
  conn
}) => {
  conn.sendContact(m.chat, [{
    name: 'Owner',
    number: global.owner,
    about: 'Owner & Creator'
  }], m, {
    org: 'Moon Support',
    website: 'https://api.alyachan.dev',
    email: 'contact@moonx.my.id'
 })
}
handler.help = ['owner']
handler.tags = ['info']
handler.command = ['owner', 'creator']
module.exports = handler
