module.exports = {
   help: ['owner'],
   command: ['creator'],
   tags: ['miscs'],
   run: async (m, {
      conn,
      env
   }) => {
      conn.sendContact(m.chat, [{
         name: env.owner_name,
         number: env.owner,
         about: 'Owner & Creator'
      }], m, {
         org: 'Moon Support',
         website: 'https://api.alyachan.dev',
         email: 'contact@moonx.my.id'
      })
   }
}