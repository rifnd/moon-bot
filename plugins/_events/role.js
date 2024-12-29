let handler = (m) => m
handler.before = async function (m, {
   users
}) {
   let role = global.rpg.role(users.level).name
   users.role = role
   return true
   return
}