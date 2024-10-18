let handler = async (m, {
   conn,
   usedPrefix,
   Func
}) => {
   let paus = db.data.users[m.sender].paus
   let kepiting = db.data.users[m.sender].kepiting
   let gurita = db.data.users[m.sender].gurita
   let cumi = db.data.users[m.sender].cumi
   let buntal = db.data.users[m.sender].buntal
   let dory = db.data.users[m.sender].dory
   let lumba = db.data.users[m.sender].lumba
   let lobster = db.data.users[m.sender].lobster
   let hiu = db.data.users[m.sender].hiu
   let udang = db.data.users[m.sender].udang
   let ikan = db.data.users[m.sender].ikan
   let orca = db.data.users[m.sender].orca
   let pancingan = db.data.users[m.sender].pancingan
   let _pancingan = db.data.users[m.sender].anakpancingan
   let cap = `乂  *K O L A M*\n\n`
   cap += `[ 🦈 ] = ${hiu} Hiu\n`
   cap += `[ 🐟 ] = ${dory} Dory\n`
   cap += `[ 🐋 ] = ${orca} Orca\n`
   cap += `[ 🐳 ] = ${paus} Paus\n`
   cap += `[ 🦑 ] = ${cumi} Cumi\n`
   cap += `[ 🐙 ] = ${gurita} Gurita\n`
   cap += `[ 🐡 ] = ${buntal} Buntal\n`
   cap += `[ 🐬 ] = ${lumba} Lumba\n`
   cap += `[ 🦞 ] = ${lobster} Lobster\n`
   cap += `[ 🦀 ] = ${kepiting} Kepiting\n\n`
   cap += `*Level Pancingan*\n`
   cap += `◦  Pancingan : *${pancingan == 0 ? 'Tidak Punya' : '' || pancingan == 1 ? 'Level 1' : '' || pancingan == 2 ? 'Level 2' : '' || pancingan == 3 ? 'Level 3' : '' || pancingan == 4 ? 'Level 4' : '' || pancingan == 5 ? 'Level MAX' : ''}*\n`
   cap += `╭────────────────\n`
   cap += `│pancingan ${pancingan == 0 ? 'Tidak Punya' : '' || pancingan > 0 && pancingan < 5 ? `Level *${pancingan}* To level *${pancingan + 1}*\n│Exp *${_pancingan}* -> *${pancingan * 10000}*` : '' || pancingan == 5 ? '*Max Level*' : ''}\n`
   cap += `╰────────────────`
   conn.reply(m.chat, cap, m)
}
handler.help = ['kolam']
handler.tags = ['rpg']
handler.command = /^(kolam)$/i
module.exports = handler