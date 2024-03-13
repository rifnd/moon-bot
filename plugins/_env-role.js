const roles = {
  'Beginner': 0,
  'Early Soldier': 5,
  'Commander': 10,
  'Initial Commander': 15,
  'Commander Elite': 20,
  'Initial Commander Elit': 25,
  'Commander Elite Hero': 30,
  'The Commander Elite Super Strong Hero': 40,
  'The Commander Elite Super Strong Shadow Hero': 50,
  'The Commander Legends Shadow Hero': 60,
  'The Commander Super Legends Shadow Hero': 70,
  'The Commander Super Legends Shadow Hero': 80,
  'The Strongest Legend': 90,
  'The Hero Of The Legend\'s Strongest': 100
}

module.exports = {
  before(m) {
    let user = global.db.data.users[m.sender]
    let level = user.level
    let role = (Object.entries(roles).sort((a, b) => b[1] - a[1]).find(([, minLevel]) => level >= minLevel) || Object.entries(roles)[0])[0]
    user.role = role
    return true
  }
}
