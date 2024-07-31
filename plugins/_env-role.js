module.exports = {
   before(m, {
      users
   }) {
      let role = global.rpg.role(users.level).name
      users.role = role
      return true
   }
}