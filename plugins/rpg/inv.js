const { xpRange } = new (require('../../lib/system/levelling'))
let handler = async (m, {
   conn,
   usedPrefix,
   env,
   Func
}) => {
   let health = db.data.users[m.sender].health
   let armor = db.data.users[m.sender].armor
   let pet = db.data.users[m.sender].pet
   let kucing = db.data.users[m.sender].kucing
   let _kucing = db.data.users[m.sender].anakkucing
   let rubah = db.data.users[m.sender].rubah
   let _rubah = db.data.users[m.sender].anakrubah
   let serigala = db.data.users[m.sender].serigala
   let _serigala = db.data.users[m.sender].anakserigala
   let naga = db.data.users[m.sender].naga
   let _naga = db.data.users[m.sender].anaknaga
   let kuda = db.data.users[m.sender].kuda
   let _kuda = db.data.users[m.sender].anakkuda
   let phonix = db.data.users[m.sender].phonix
   let _phonix = db.data.users[m.sender].anakphonix
   let griffin = db.data.users[m.sender].griffin
   let _griffin = db.data.users[m.sender].anakgriffin
   let kyubi = db.data.users[m.sender].kyubi
   let _kyubi = db.data.users[m.sender].anakkyubi
   let centaur = db.data.users[m.sender].centaur
   let _centaur = db.data.users[m.sender].anakcentaur
   let diamond = db.data.users[m.sender].diamond
   let potion = db.data.users[m.sender].potion
   let ramuan = db.data.users[m.sender].ramuan
   let common = db.data.users[m.sender].common
   let makananpet = db.data.users[m.sender].makananpet
   let makanannaga = db.data.users[m.sender].makanannaga
   let makananphonix = db.data.users[m.sender].makananphonix
   let makanangriffin = db.data.users[m.sender].makanangriffin
   let makanankyubi = db.data.users[m.sender].makanankyubi
   let makanancentaur = db.data.users[m.sender].makanancentaur
   let uncommon = db.data.users[m.sender].uncommon
   let mythic = db.data.users[m.sender].mythic
   let legendary = db.data.users[m.sender].legendary
   let level = db.data.users[m.sender].level
   let money = db.data.users[m.sender].money
   let exp = db.data.users[m.sender].exp
   let sampah = db.data.users[m.sender].sampah
   let anggur = db.data.users[m.sender].anggur
   let jeruk = db.data.users[m.sender].jeruk
   let apel = db.data.users[m.sender].apel
   let mangga = db.data.users[m.sender].mangga
   let pisang = db.data.users[m.sender].pisang
   let bibitanggur = db.data.users[m.sender].bibitanggur
   let bibitjeruk = db.data.users[m.sender].bibitjeruk
   let bibitapel = db.data.users[m.sender].bibitapel
   let bibitmangga = db.data.users[m.sender].bibitmangga
   let bibitpisang = db.data.users[m.sender].bibitpisang
   let gardenboxs = db.data.users[m.sender].gardenboxs
   let nabung = db.data.users[m.sender].nabung
   let bank = db.data.users[m.sender].bank
   let limit = db.data.users[m.sender].limit
   let cupon = db.data.users[m.sender].cupon
   let tiketcoin = db.data.users[m.sender].tiketcoin
   let tiketm = db.data.users[m.sender].healtmonster
   let aqua = db.data.users[m.sender].aqua
   let expg = db.data.users[m.sender].expg
   let boxs = db.data.users[m.sender].boxs
   let botol = db.data.users[m.sender].botol
   let kayu = db.data.users[m.sender].kayu
   let batu = db.data.users[m.sender].batu
   let iron = db.data.users[m.sender].iron
   let sword = db.data.users[m.sender].sword
   let string = db.data.users[m.sender].string
   let kaleng = db.data.users[m.sender].kaleng
   let kardus = db.data.users[m.sender].kardus
   let berlian = db.data.users[m.sender].berlian
   let emas = db.data.users[m.sender].emas
   let emaspro = db.data.users[m.sender].emasbatang
   let hero = db.data.users[m.sender].hero
   let exphero = db.data.users[m.sender].exphero
   let { max } = xpRange(level, exp, env.multiplier)
   let name = m.sender
   let sortedmoney = Object.entries(db.data.users).sort((a, b) => b[1].money - a[1].money)
   let sortedlevel = Object.entries(db.data.users).sort((a, b) => b[1].level - a[1].level)
   let sorteddiamond = Object.entries(db.data.users).sort((a, b) => b[1].diamond - a[1].diamond)
   let sortedpotion = Object.entries(db.data.users).sort((a, b) => b[1].potion - a[1].potion)
   let sortedsampah = Object.entries(db.data.users).sort((a, b) => b[1].sampah - a[1].sampah)
   let sortedcommon = Object.entries(db.data.users).sort((a, b) => b[1].common - a[1].common)
   let sorteduncommon = Object.entries(db.data.users).sort((a, b) => b[1].uncommon - a[1].uncommon)
   let sortedmythic = Object.entries(db.data.users).sort((a, b) => b[1].mythic - a[1].mythic)
   let sortedlegendary = Object.entries(db.data.users).sort((a, b) => b[1].legendary - a[1].legendary)
   let usersmoney = sortedmoney.map(v => v[0])
   let usersdiamond = sorteddiamond.map(v => v[0])
   let userspotion = sortedpotion.map(v => v[0])
   let userssampah = sortedsampah.map(v => v[0])
   let userslevel = sortedlevel.map(v => v[0])
   let userscommon = sortedcommon.map(v => v[0])
   let usersuncommon = sorteduncommon.map(v => v[0])
   let usersmythic = sortedmythic.map(v => v[0])
   let userslegendary = sortedlegendary.map(v => v[0])
   let str = `
Inventory *@${m.sender.replace(/@.+/g, '')}*

◦  Health : *${health}*
◦  Armor : *${armor == 0 ? 'Tidak Punya' : '' || armor == 1 ? 'Leather Armor' : '' || armor == 2 ? 'Iron Armor' : '' || armor == 3 ? 'Gold Armor' : '' || armor == 4 ? 'Diamond Armor' : '' || armor == 5 ? 'Netherite Armor' : ''}*
◦  Money : *${money}*
◦  Limit : *${limit}*
◦  Level : *${level}*
◦  Exp : *${exp}*
◦  Atm : *${bank}*
◦  Cupon : *${cupon}*
◦  Exp : *${expg}*
◦  Tiketm : *${tiketm}*
◦  Tiketcoin: *${tiketcoin}*

*Inventory*
◦  Potion : *${potion}*
◦  Ramuan : *${ramuan}*
◦  Iron : *${iron}*
◦  String : *${string}*
◦  Sword : *${sword}*
◦  Sampah : *${sampah}*
◦  Kayu : *${kayu}*
◦  Batu : *${batu}*
◦  Aqua : *${aqua}*
◦  Makanan Pet : *${makananpet}*
◦  Makanan Phonix : *${makananphonix}*
◦  Makanan Naga : *${makanannaga}*
◦  Makanan Griffin : *${makanangriffin}*
◦  Makanan Kyubi : *${makanankyubi}*
◦  Makanan Centaur : *${makanancentaur}*
◦  Total inv : *${diamond + potion + ramuan + sampah + kayu + sword + iron + string + makananpet + makananphonix + makanannaga + makanangriffin + makanankyubi + makanancentaur}* item

*Crate*
◦  Boxs : *${boxs}*
◦  Common : *${common}*
◦  Uncommon : *${uncommon}*
◦  Mythic : *${mythic}*
◦  Legendary : *${legendary}*.
◦  Pet : *${pet}*
◦  Gardenboxs : *${gardenboxs}*

*Fruits*
◦  Mangga : ${mangga}
◦  Anggur : ${anggur}
◦  Pisang : ${pisang}
◦  Jeruk : ${jeruk}
◦  Apel : ${apel}

*Seeds*
◦  Bibit Mangga : ${bibitmangga}
◦  Bibit Anggur : ${bibitanggur}
◦  Bibit Pisang : ${bibitpisang}
◦  Bibit Jeruk : ${bibitjeruk}
◦  Bibit Apel : ${bibitapel}

*Trash Man*
◦  Kardus : ${kardus}
◦  Botol : ${botol}

*Mining*
◦  Berlian : ${berlian}
◦  Emas : ${emas}
◦  Diamond : ${diamond}

*Hero*
◦  My Hero : *${hero == 0 ? 'Tidak Punya' : '' || hero == 1 ? 'Level 1' : '' || hero == 2 ? 'Level 2' : '' || hero == 3 ? 'Level 3' : '' || hero == 4 ? 'Level 4' : '' || hero == 5 ? 'Level 5' : '' || hero == 6 ? 'Level 6' : '' || hero == 7 ? 'Level 7' : '' || hero == 8 ? 'Level 8' : '' || hero == 9 ? 'Level 9' : '' || hero == 10 ? 'Level 10' : '' || hero == 11 ? 'Level 11' : '' || hero == 12 ? 'Level 12' : '' || hero == 13 ? 'Level 13' : '' || hero == 14 ? 'Level 14' : '' || hero == 15 ? 'Level 15' : '' || hero == 16 ? 'Level 16' : '' || hero == 17 ? 'Level 17' : '' || hero == 18 ? 'Level 18' : '' || hero == 19 ? 'Level 19' : '' || hero == 20 ? 'Level 20' : '' || hero == 21 ? 'Level 21' : '' || hero == 22 ? 'Level 22' : '' || hero == 23 ? 'Level 23' : '' || hero == 24 ? 'Level 24' : '' || hero == 25 ? 'Level 25' : '' || hero == 26 ? 'Level 26' : '' || hero == 27 ? 'Level 27' : '' || hero == 28 ? 'Level 28' : '' || hero == 29 ? 'Level 29' : '' || hero == 30 ? 'Level 30' : '' || hero == 31 ? 'Level 31' : '' || hero == 32 ? 'Level 32' : '' || hero == 33 ? 'Level 33' : '' || hero == 34 ? 'Level 34' : '' || hero == 35 ? 'Level 35' : '' || hero == 36 ? 'Level 36' : '' || hero == 37 ? 'Level 37' : '' || hero == 38 ? 'Level 38' : '' || hero == 39 ? 'Level 39' : '' || hero == 40 ? 'Level MAX' : ''}*

*Pet*
◦  Kucing : *${kucing == 0 ? 'Tidak Punya' : '' || kucing == 1 ? 'Level 1' : '' || kucing == 2 ? 'Level 2' : '' || kucing == 3 ? 'Level 3' : '' || kucing == 4 ? 'Level 4' : '' || kucing == 5 ? 'Level MAX' : ''}*
◦  Kuda : *${kuda == 0 ? 'Tidak Punya' : '' || kuda == 1 ? 'Level 1' : '' || kuda == 2 ? 'Level 2' : '' || kuda == 3 ? 'Level 3' : '' || kuda == 4 ? 'Level 4' : '' || kuda == 5 ? 'Level MAX' : ''}*
◦  Naga : *${naga == 0 ? 'Tidak Punya' : '' || naga == 1 ? 'Level 1' : '' || naga == 2 ? 'Level 2' : '' || naga == 3 ? 'Level 3' : '' || naga == 4 ? 'Level 4' : '' || naga == 5 ? 'Level 5' : '' || naga == 6 ? 'Level 6' : '' || naga == 7 ? 'Level 7' : '' || naga == 8 ? 'Level 8' : '' || naga == 9 ? 'Level 9' : '' || naga == 10 ? 'Level 10' : '' || naga == 11 ? 'Level 11' : '' || naga == 12 ? 'Level 12' : '' || naga == 13 ? 'Level 13' : '' || naga == 14 ? 'Level 14' : '' || naga == 15 ? 'Level 15' : '' || naga == 16 ? 'Level 16' : '' || naga == 17 ? 'Level 17' : '' || naga == 18 ? 'Level 18' : '' || naga == 19 ? 'Level 19' : '' || naga == 20 ? 'Level MAX' : ''}*
◦  Kyubi : *${kyubi == 0 ? 'Tidak Punya' : '' || kyubi == 1 ? 'Level 1' : '' || kyubi == 2 ? 'Level 2' : '' || kyubi == 3 ? 'Level 3' : '' || kyubi == 4 ? 'Level 4' : '' || kyubi == 5 ? 'Level 5' : '' || kyubi == 6 ? 'Level 6' : '' || kyubi == 7 ? 'Level 7' : '' || kyubi == 8 ? 'Level 8' : '' || kyubi == 9 ? 'Level 9' : '' || kyubi == 10 ? 'Level 10' : '' || kyubi == 11 ? 'Level 11' : '' || kyubi == 12 ? 'Level 12' : '' || kyubi == 13 ? 'Level 13' : '' || kyubi == 14 ? 'Level 14' : '' || kyubi == 15 ? 'Level 15' : '' || kyubi == 16 ? 'Level 16' : '' || kyubi == 17 ? 'Level 17' : '' || kyubi == 18 ? 'Level 18' : '' || kyubi == 19 ? 'Level 19' : '' || kyubi == 20 ? 'Level MAX' : ''}*
◦  Centaur : *${centaur == 0 ? 'Tidak Punya' : '' || centaur == 1 ? 'Level 1' : '' || centaur == 2 ? 'Level 2' : '' || centaur == 3 ? 'Level 3' : '' || centaur == 4 ? 'Level 4' : '' || centaur == 5 ? 'Level 5' : '' || centaur == 6 ? 'Level 6' : '' || centaur == 7 ? 'Level 7' : '' || centaur == 8 ? 'Level 8' : '' || centaur == 9 ? 'Level 9' : '' || centaur == 10 ? 'Level 10' : '' || centaur == 11 ? 'Level 11' : '' || centaur == 12 ? 'Level 12' : '' || centaur == 13 ? 'Level 13' : '' || centaur == 14 ? 'Level 14' : '' || centaur == 15 ? 'Level 15' : '' || centaur == 16 ? 'Level 16' : '' || centaur == 17 ? 'Level 17' : '' || centaur == 18 ? 'Level 18' : '' || centaur == 19 ? 'Level 19' : '' || centaur == 20 ? 'Level MAX' : ''}*
◦  Rubah : *${rubah == 0 ? 'Tidak Punya' : '' || rubah == 1 ? 'Level 1' : '' || rubah == 2 ? 'Level 2' : '' || rubah == 3 ? 'Level 3' : '' || rubah == 4 ? 'Level 4' : '' || rubah == 5 ? 'Level MAX' : ''}*
◦  Phonix : *${phonix == 0 ? 'Tidak Punya' : '' || phonix == 1 ? 'Level 1' : '' || phonix == 2 ? 'Level 2' : '' || phonix == 3 ? 'Level 3' : '' || phonix == 4 ? 'Level 4' : '' || phonix == 5 ? 'Level 5' : '' || phonix == 6 ? 'Level 6' : '' || phonix == 7 ? 'Level 7' : '' || phonix == 8 ? 'Level 8' : '' || phonix == 9 ? 'Level 9' : '' || phonix == 10 ? 'Level 10' : '' || phonix == 11 ? 'Level 11' : '' || phonix == 12 ? 'Level 12' : '' || phonix == 13 ? 'Level 13' : '' || phonix == 14 ? 'Level 14' : '' || phonix == 15 ? 'Level MAX' : ''}*
◦  Griffin : *${griffin == 0 ? 'Tidak Punya' : '' || griffin == 1 ? 'Level 1' : '' || griffin == 2 ? 'Level 2' : '' || griffin == 3 ? 'Level 3' : '' || griffin == 4 ? 'Level 4' : '' || griffin == 5 ? 'Level 5' : '' || griffin == 6 ? 'Level 6' : '' || griffin == 7 ? 'Level 7' : '' || griffin == 8 ? 'Level 8' : '' || griffin == 9 ? 'Level 9' : '' || griffin == 10 ? 'Level 10' : '' || griffin == 11 ? 'Level 11' : '' || griffin == 12 ? 'Level 12' : '' || griffin == 13 ? 'Level 13' : '' || griffin == 14 ? 'Level 14' : '' || griffin == 15 ? 'Level MAX' : ''}*
◦  Serigala : *${serigala == 0 ? 'Tidak Punya' : '' || serigala == 1 ? 'Level 1' : '' || serigala == 2 ? 'Level 2' : '' || serigala == 3 ? 'Level 3' : '' || serigala == 4 ? 'Level 4' : '' || serigala == 5 ? 'Level 5' : '' || serigala == 6 ? 'Level 6' : '' || serigala == 7 ? 'Level 7' : '' || serigala == 8 ? 'Level 8' : '' || serigala == 9 ? 'Level 9' : '' || serigala == 10 ? 'Level 10' : '' || serigala == 11 ? 'Level 11' : '' || serigala == 12 ? 'Level 12' : '' || serigala == 13 ? 'Level 13' : '' || serigala == 14 ? 'Level 14' : '' || serigala == 15 ? 'Level MAX' : ''}*\n
*Proges*
╭────────────────
│Level *${level}* To Level *${level}*
│Exp *${exp}* -> *${max}*
│
│Hero ${hero == 0 ? 'Tidak Punya' : '' || hero > 0 && hero < 40 ? `Level *${hero}* To level *${hero + 1}*\n│Exp *${exphero}* -> *${hero * 500}*` : '' || hero == 40 ? '*Max Level*' : ''}
╰────────────────
╭────────────────
│Rubah ${rubah == 0 ? 'Tidak Punya' : '' || rubah > 0 && rubah < 5 ? `Level *${rubah}* To level *${rubah + 1}*\n│Exp *${_rubah}* -> *${rubah * 1000}*` : '' || rubah == 5 ? '*Max Level*' : ''}
╰────────────────
╭────────────────
│Kucing ${kucing == 0 ? 'Tidak Punya' : '' || kucing > 0 && kucing < 5 ? `Level *${kucing}* To level *${kucing + 1}*\n│Exp *${_kucing}* -> *${kucing * 1000}*` : '' || kucing == 5 ? '*Max Level*' : ''}
╰────────────────
╭────────────────
│Kuda ${kuda == 0 ? 'Tidak Punya' : '' || kuda > 0 && kuda < 5 ? `Level *${kuda}* To level *${kuda + 1}*\n│Exp *${_kuda}* -> *${kuda * 1000}*` : '' || kuda == 5 ? '*Max Level*' : ''}
╰────────────────
╭────────────────
│Naga ${naga == 0 ? 'Tidak Punya' : '' || naga > 0 && naga < 20 ? `Level *${naga}* To level *${naga + 1}*\n│Exp *${_naga}* -> *${naga * 10000}*` : '' || naga == 20 ? '*Max Level*' : ''}
╰────────────────
╭────────────────
│Phonix ${phonix == 0 ? 'Tidak Punya' : '' || phonix > 0 && phonix < 15 ? `Level *${phonix}* To level *${phonix + 1}*\n│Exp *${_phonix}* -> *${phonix * 10000}*` : '' || phonix == 15 ? '*Max Level*' : ''}
╰────────────────
╭────────────────
│Kyubi ${kyubi == 0 ? 'Tidak Punya' : '' || kyubi > 0 && kyubi < 20 ? `Level *${kyubi}* To level *${kyubi + 1}*\n│Exp *${_kyubi}* -> *${kyubi * 10000}*` : '' || kyubi == 20 ? '*Max Level*' : ''}
╰────────────────
╭────────────────
│Centaur ${centaur == 0 ? 'Tidak Punya' : '' || centaur > 0 && centaur < 20 ? `Level *${centaur}* To level *${centaur + 1}*\n│Exp *${_centaur}* -> *${centaur * 10000}*` : '' || centaur == 20 ? '*Max Level*' : ''}
╰────────────────
╭────────────────
│Griffin ${griffin == 0 ? 'Tidak Punya' : '' || griffin > 0 && griffin < 15 ? `Level *${griffin}* To level *${griffin + 1}*\n│Exp *${_griffin}* -> *${griffin * 10000}*` : '' || griffin == 15 ? '*Max Level*' : ''}
╰────────────────
╭────────────────
│Serigala ${serigala == 0 ? 'Tidak Punya' : '' || serigala > 0 && serigala < 15 ? `Level *${serigala}* To level *${serigala + 1}*\n│Exp *${_serigala}* -> *${serigala * 10000}*` : '' || serigala == 15 ? '*Max Level*' : ''}
╰────────────────\n\n
*Achievement*
1. Top level *${userslevel.indexOf(m.sender) + 1}* dari *${userslevel.length}*
2. Top Money *${usersmoney.indexOf(m.sender) + 1}* dari *${usersmoney.length}*
3. Top Diamond *${usersdiamond.indexOf(m.sender) + 1}* dari *${usersdiamond.length}*
4. Top Potion *${userspotion.indexOf(m.sender) + 1}* dari *${userspotion.length}*
5. Top Common *${userscommon.indexOf(m.sender) + 1}* dari *${userscommon.length}*
6. Top Uncommon *${usersuncommon.indexOf(m.sender) + 1}* dari *${usersuncommon.length}*
7. Top Mythic *${usersmythic.indexOf(m.sender) + 1}* dari *${usersmythic.length}*
8. Top Legendary *${userslegendary.indexOf(m.sender) + 1}* dari *${userslegendary.length}*
9. Top Sampah *${userssampah.indexOf(m.sender) + 1}* dari *${userssampah.length}*
\n${readMore}
`.trim()
   conn.reply(m.chat, str, m)
}
handler.help = ['inventory']
handler.tags = ['rpg']
handler.command = /^(inv|inventory)$/i
module.exports = handler

const more = String.fromCharCode(8206)
const readMore = more.repeat(4001)