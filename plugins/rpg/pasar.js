const Skepiting = 7000
const Slobster = 7000
const Sudang = 7000
const Scumi = 7000
const Sgurita = 7000
const Sbuntal = 7000
const Sdory = 7000
const Sorca = 7000
const Slumba = 7000
const Spaus = 7000
const Sikan = 7000
const Shiu = 7000
const Sbanteng = 9000
const Sharimau = 9000
const Sgajah = 9000
const Skambing = 9000
const Spanda = 9000
const Sbuaya = 9000
const Skerbau = 9000
const Ssapi = 9000
const Smonyet = 9000
const Sbabihutan = 9000
const Sbabi = 9000
const Sayam = 9000
let handler = async (m, { conn, command, args, Func }) => {
   const _armor = db.data.users[m.sender].armor
   const armor = (_armor == 0 ? 20000 : '' || _armor == 1 ? 49999 : '' || _armor == 2 ? 99999 : '' || _armor == 3 ? 149999 : '' || _armor == 4 ? 299999 : '')
   let type = (args[0] || '').toLowerCase()
   let _type = (args[1] || '').toLowerCase()
   let jualbeli = (args[0] || '').toLowerCase()
   const Kchat = `━━━━━━━━━━━━━━━━━
*🌱 Hewan   | 💲 Harga Jual*\n━━━━━━━━━━━━━━━━━\n
🦀 Kepiting:      ${Skepiting}
🦞 Lobster:       ${Slobster}
🦐 Udang:         ${Sudang}
🦑 Cumi:           ${Scumi}
🐙 Gurita:         ${Sgurita}
🐡 Buntal:         ${Sbuntal}
🐠 Dory:            ${Sdory}
🐳 Orca:            ${Sorca}
🐬 Lumba:        ${Slumba}
🐋 Paus:           ${Spaus}
🦈 Hiu:              ${Shiu}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🐃 Banteng:      ${Sbanteng}
🐅 Harimau:      ${Sharimau}
🐘 Gajah:           ${Sgajah}
🐐 Kambing:     ${Skambing}
🐼 Panda:         ${Spanda}
🐃 Kerbau:        ${Skerbau}
🐊 Buaya:         ${Sbuaya}
🐂 Sapi:            ${Ssapi}
🐒 Monyet:       ${Smonyet}
🐗 Babi Hutan: ${Sbabihutan}
🐖 Babi:             ${Sbabi}
🐔 Ayam:           ${Sayam}\n━━━━━━━━━━━━━━━━━\n━━━━━━━━━━━━━━━━━
🧪 *Contoh penggunaan :*
#pasar jual ayam
`.trim()
   try {
      if (/pasar|toko/i.test(command)) {
         const count = args[2] && args[2].length > 0 ? Math.min(99999999, Math.max(parseInt(args[2]), 1)) : !args[2] || args.length < 4 ? 1 : Math.min(1, count)
         const sampah = db.data.users[m.sender].sampah
         switch (jualbeli) {
            case 'jual':
               switch (_type) {
                  case 'banteng':
                     if (db.data.users[m.sender].banteng >= count * 1) {
                        db.data.users[m.sender].money += Spaus * count
                        db.data.users[m.sender].banteng -= count * 1
                        conn.reply(m.chat, `Sukses Menjual ${count} Banteng Dengan Harga ${Sbanteng * count} Money `.trim(), m)
                     } else conn.reply(m.chat, `Banteng Kamu Tidak Cukup`.trim(), m)
                     break
                  case 'harimau':
                     if (db.data.users[m.sender].harimau >= count * 1) {
                        db.data.users[m.sender].money += Sharimau * count
                        db.data.users[m.sender].harimau -= count * 1
                        conn.reply(m.chat, `Sukses Menjual ${count} Harimau Dengan Harga ${Sharimau * count} Money `.trim(), m)
                     } else conn.reply(m.chat, `Harimau Kamu Tidak Cukup`.trim(), m)
                     break
                  case 'gajah':
                     if (db.data.users[m.sender].gajah >= count * 1) {
                        db.data.users[m.sender].money += Sgajah * count
                        db.data.users[m.sender].gajah -= count * 1
                        conn.reply(m.chat, `Sukses Menjual ${count} Gajah Dengan Harga ${Sgajah * count} Money `.trim(), m)
                     } else conn.reply(m.chat, `Gajah Kamu Tidak Cukup`.trim(), m)
                     break
                  case 'kambing':
                     if (db.data.users[m.sender].kambing >= count * 1) {
                        db.data.users[m.sender].money += Skambing * count
                        db.data.users[m.sender].kambing -= count * 1
                        conn.reply(m.chat, `Sukses Menjual ${count} Kambing Dengan Harga ${Skambing * count} Money `.trim(), m)
                     } else conn.reply(m.chat, `Kambing Kamu Tidak Cukup`.trim(), m)
                     break
                  case 'panda':
                     if (db.data.users[m.sender].panda >= count * 1) {
                        db.data.users[m.sender].money += Spanda * count
                        db.data.users[m.sender].panda -= count * 1
                        conn.reply(m.chat, `Sukses Menjual ${count} Panda Dengan Harga ${Sbuaya * count} Money `.trim(), m)
                     } else conn.reply(m.chat, `Panda Kamu Tidak Cukup`.trim(), m)
                     break
                  case 'buaya':
                     if (db.data.users[m.sender].buaya >= count * 1) {
                        db.data.users[m.sender].money += Sbuaya * count
                        db.data.users[m.sender].buaya -= count * 1
                        conn.reply(m.chat, `Sukses Menjual ${count} Buaya Dengan Harga ${Sbuaya * count} Money `.trim(), m)
                     } else conn.reply(m.chat, `Buaya Kamu Tidak Cukup`.trim(), m)
                     break
                  case 'kerbau':
                     if (db.data.users[m.sender].kerbau >= count * 1) {
                        db.data.users[m.sender].money += Skerbau * count
                        db.data.users[m.sender].kerbau -= count * 1
                        conn.reply(m.chat, `Sukses Menjual ${count} Kerbau Dengan Harga ${Skerbau * count} Money `.trim(), m)
                     } else conn.reply(m.chat, `Kerbau Kamu Tidak Cukup`.trim(), m)
                     break
                  case 'sapi':
                     if (db.data.users[m.sender].sapi >= count * 1) {
                        db.data.users[m.sender].money += Ssapi * count
                        db.data.users[m.sender].sapi -= count * 1
                        conn.reply(m.chat, `Sukses Menjual ${count} Sapi Dengan Harga ${Ssapi * count} Money `.trim(), m)
                     } else conn.reply(m.chat, `Sapi Kamu Tidak Cukup`.trim(), m)
                     break
                  case 'monyet':
                     if (db.data.users[m.sender].monyet >= count * 1) {
                        db.data.users[m.sender].money += Smonyet * count
                        db.data.users[m.sender].monyet -= count * 1
                        conn.reply(m.chat, `Sukses Menjual ${count} Monyet Dengan Harga ${Smonyet * count} Money `.trim(), m)
                     } else conn.reply(m.chat, `Monyet Kamu Tidak Cukup`.trim(), m)
                     break
                  case 'babi':
                     if (db.data.users[m.sender].babi >= count * 1) {
                        db.data.users[m.sender].money += Skepiting * count
                        db.data.users[m.sender].babi -= count * 1
                        conn.reply(m.chat, `Sukses Menjual ${count} Babi Dengan Harga ${Sbabi * count} Money `.trim(), m)
                     } else conn.reply(m.chat, `Babi Kamu Tidak Cukup`.trim(), m)
                     break
                  case 'babihutan':
                     if (db.data.users[m.sender].babihutan >= count * 1) {
                        db.data.users[m.sender].money += Sbabihutan * count
                        db.data.users[m.sender].babihutan -= count * 1
                        conn.reply(m.chat, `Sukses Menjual ${count} Babi Hutan Dengan Harga ${Sbabihutan * count} Money `.trim(), m)
                     } else conn.reply(m.chat, `Babi Hutan Kamu Tidak Cukup`.trim(), m)
                     break
                  case 'ayam':
                     if (db.data.users[m.sender].ayam >= count * 1) {
                        db.data.users[m.sender].money += Sayam * count
                        db.data.users[m.sender].ayam -= count * 1
                        conn.reply(m.chat, `Sukses Menjual ${count} Ayam Dengan Harga ${Sayam * count} Money `.trim(), m)
                     } else conn.reply(m.chat, `Ayam Kamu Tidak Cukup`.trim(), m)
                     break
                  //mancing
                  case 'kepiting':
                     if (db.data.users[m.sender].kepiting >= count * 1) {
                        db.data.users[m.sender].money += Skepiting * count
                        db.data.users[m.sender].kepiting -= count * 1
                        conn.reply(m.chat, `Sukses Menjual ${count} Kepiting Dengan Harga ${Skepiting * count} Money `.trim(), m)
                     } else conn.reply(m.chat, `Kepiting Kamu Tidak Cukup`.trim(), m)
                     break
                  case 'ikan':
                     if (db.data.users[m.sender].ikan >= count * 1) {
                        db.data.users[m.sender].money += Skepiting * count
                        db.data.users[m.sender].ikan -= count * 1
                        conn.reply(m.chat, `Sukses Menjual ${count} Ikan Dengan Harga ${Sikan * count} Money `.trim(), m)
                     } else conn.reply(m.chat, `Ikan Kamu Tidak Cukup`.trim(), m)
                     break
                  case 'dory':
                     if (db.data.users[m.sender].dory >= count * 1) {
                        db.data.users[m.sender].money += Sdory * count
                        db.data.users[m.sender].dory -= count * 1
                        conn.reply(m.chat, `Sukses Menjual ${count} Ikan Dory Dengan Harga ${Sdory * count} Money `.trim(), m)
                     } else conn.reply(m.chat, `Ikan Dory Kamu Tidak Cukup`.trim(), m)
                     break
                  case 'gurita':
                     if (db.data.users[m.sender].gurita >= count * 1) {
                        db.data.users[m.sender].money += Skepiting * count
                        db.data.users[m.sender].gurita -= count * 1
                        conn.reply(m.chat, `Sukses Menjual ${count} Gurita Dengan Harga ${Sgurita * count} Money `.trim(), m)
                     } else conn.reply(m.chat, `Gurita Kamu Tidak Cukup`.trim(), m)
                     break
                  case 'buntal':
                     if (db.data.users[m.sender].buntal >= count * 1) {
                        db.data.users[m.sender].money += Sbuntal * count
                        db.data.users[m.sender].buntal -= count * 1
                        conn.reply(m.chat, `Sukses Menjual ${count} Ikan Buntal Dengan Harga ${Sbuntal * count} Money `.trim(), m)
                     } else conn.reply(m.chat, `Ikan Buntal Kamu Tidak Cukup`.trim(), m)
                     break
                  case 'hiu':
                     if (db.data.users[m.sender].hiu >= count * 1) {
                        db.data.users[m.sender].money += Shiu * count
                        db.data.users[m.sender].hiu -= count * 1
                        conn.reply(m.chat, `Sukses Menjual ${count} Hiu Dengan Harga ${Shiu * count} Money `.trim(), m)
                     } else conn.reply(m.chat, `Hiu Kamu Tidak Cukup`.trim(), m)
                     break
                  case 'orca':
                     if (db.data.users[m.sender].orca >= count * 1) {
                        db.data.users[m.sender].money += Sorca * count
                        db.data.users[m.sender].orca -= count * 1
                        conn.reply(m.chat, `Sukses Menjual ${count} Paus Orca Dengan Harga ${Sorca * count} Money `.trim(), m)
                     } else conn.reply(m.chat, `Paus Orca Kamu Tidak Cukup`.trim(), m)
                     break
                  case 'lumba':
                     if (db.data.users[m.sender].lumba >= count * 1) {
                        db.data.users[m.sender].money += Skepiting * count
                        db.data.users[m.sender].lumba -= count * 1
                        conn.reply(m.chat, `Sukses Menjual ${count} Lumba Lumba Dengan Harga ${Slumba * count} Money `.trim(), m)
                     } else conn.reply(m.chat, `Lumba Lumba Kamu Tidak Cukup`.trim(), m)
                     break
                  case 'paus':
                     if (db.data.users[m.sender].paus >= count * 1) {
                        db.data.users[m.sender].money += Spaus * count
                        db.data.users[m.sender].paus -= count * 1
                        conn.reply(m.chat, `Sukses Menjual ${count} Paus Dengan Harga ${Spaus * count} Money `.trim(), m)
                     } else conn.reply(m.chat, `Paus Kamu Tidak Cukup`.trim(), m)
                     break
                  case 'lobster':
                     if (db.data.users[m.sender].lobster >= count * 1) {
                        db.data.users[m.sender].money += Slobster * count
                        db.data.users[m.sender].lobster -= count * 1
                        conn.reply(m.chat, `Sukses Menjual ${count} Lobster Dengan Harga ${Slobster * count} Money `.trim(), m)
                     } else conn.reply(m.chat, `Lobster Kamu Tidak Cukup`.trim(), m)
                     break
                  case 'udang':
                     if (db.data.users[m.sender].udang >= count * 1) {
                        db.data.users[m.sender].money += Sudang * count
                        db.data.users[m.sender].udang -= count * 1
                        conn.reply(m.chat, `Sukses Menjual ${count} Udang Dengan Harga ${Sudang * count} Money `.trim(), m)
                     } else conn.reply(m.chat, `Udang Kamu Tidak Cukup`.trim(), m)
                     break
                  case 'cumi':
                     if (db.data.users[m.sender].cumi >= count * 1) {
                        db.data.users[m.sender].money += Scumi * count
                        db.data.users[m.sender].cumi -= count * 1
                        conn.reply(m.chat, `Sukses Menjual ${count} Cumi Dengan Harga ${Scumi * count} Money `.trim(), m)
                     } else conn.reply(m.chat, `Cumi Kamu Tidak Cukup`.trim(), m)
                     break
                  default:
                     return conn.reply(m.chat, Kchat, m)
               }
               break
            default:
               return m.reply(Kchat)
         }
      } else if (/sell|jual|/i.test(command)) {
         const count = args[1] && args[1].length > 0 ? Math.min(99999999, Math.max(parseInt(args[1]), 1)) : !args[1] || args.length < 3 ? 1 : Math.min(1, count)
         switch (type) {
            case 'banteng':
               if (db.data.users[m.sender].banteng >= count * 1) {
                  db.data.users[m.sender].money += Spaus * count
                  db.data.users[m.sender].banteng -= count * 1
                  conn.reply(m.chat, `Sukses Menjual ${count} Banteng Dengan Harga ${Sbanteng * count} Money `.trim(), m)
               } else conn.reply(m.chat, `Banteng Kamu Tidak Cukup`.trim(), m)
               break
            case 'harimau':
               if (db.data.users[m.sender].harimau >= count * 1) {
                  db.data.users[m.sender].money += Sharimau * count
                  db.data.users[m.sender].harimau -= count * 1
                  conn.reply(m.chat, `Sukses Menjual ${count} Harimau Dengan Harga ${Sharimau * count} Money `.trim(), m)
               } else conn.reply(m.chat, `Harimau Kamu Tidak Cukup`.trim(), m)
               break
            case 'gajah':
               if (db.data.users[m.sender].gajah >= count * 1) {
                  db.data.users[m.sender].money += Sgajah * count
                  db.data.users[m.sender].gajah -= count * 1
                  conn.reply(m.chat, `Sukses Menjual ${count} Gajah Dengan Harga ${Sgajah * count} Money `.trim(), m)
               } else conn.reply(m.chat, `Gajah Kamu Tidak Cukup`.trim(), m)
               break
            case 'kambing':
               if (db.data.users[m.sender].kambing >= count * 1) {
                  db.data.users[m.sender].money += Skambing * count
                  db.data.users[m.sender].kambing -= count * 1
                  conn.reply(m.chat, `Sukses Menjual ${count} Kambing Dengan Harga ${Skambing * count} Money `.trim(), m)
               } else conn.reply(m.chat, `Kambing Kamu Tidak Cukup`.trim(), m)
               break
            case 'panda':
               if (db.data.users[m.sender].panda >= count * 1) {
                  db.data.users[m.sender].money += Spanda * count
                  db.data.users[m.sender].panda -= count * 1
                  conn.reply(m.chat, `Sukses Menjual ${count} Panda Dengan Harga ${Sbuaya * count} Money `.trim(), m)
               } else conn.reply(m.chat, `Panda Kamu Tidak Cukup`.trim(), m)
               break
            case 'buaya':
               if (db.data.users[m.sender].buaya >= count * 1) {
                  db.data.users[m.sender].money += Sbuaya * count
                  db.data.users[m.sender].buaya -= count * 1
                  conn.reply(m.chat, `Sukses Menjual ${count} Buaya Dengan Harga ${Sbuaya * count} Money `.trim(), m)
               } else conn.reply(m.chat, `Buaya Kamu Tidak Cukup`.trim(), m)
               break
            case 'kerbau':
               if (db.data.users[m.sender].kerbau >= count * 1) {
                  db.data.users[m.sender].money += Skerbau * count
                  db.data.users[m.sender].kerbau -= count * 1
                  conn.reply(m.chat, `Sukses Menjual ${count} Kerbau Dengan Harga ${Skerbau * count} Money `.trim(), m)
               } else conn.reply(m.chat, `Kerbau Kamu Tidak Cukup`.trim(), m)
               break
            case 'sapi':
               if (db.data.users[m.sender].sapi >= count * 1) {
                  db.data.users[m.sender].money += Ssapi * count
                  db.data.users[m.sender].sapi -= count * 1
                  conn.reply(m.chat, `Sukses Menjual ${count} Sapi Dengan Harga ${Ssapi * count} Money `.trim(), m)
               } else conn.reply(m.chat, `Sapi Kamu Tidak Cukup`.trim(), m)
               break
            case 'monyet':
               if (db.data.users[m.sender].monyet >= count * 1) {
                  db.data.users[m.sender].money += Smonyet * count
                  db.data.users[m.sender].monyet -= count * 1
                  conn.reply(m.chat, `Sukses Menjual ${count} Monyet Dengan Harga ${Smonyet * count} Money `.trim(), m)
               } else conn.reply(m.chat, `Monyet Kamu Tidak Cukup`.trim(), m)
               break
            case 'babi':
               if (db.data.users[m.sender].babi >= count * 1) {
                  db.data.users[m.sender].money += Sbabi * count
                  db.data.users[m.sender].babi -= count * 1
                  conn.reply(m.chat, `Sukses Menjual ${count} Babi Dengan Harga ${Sbabi * count} Money `.trim(), m)
               } else conn.reply(m.chat, `Babi Kamu Tidak Cukup`.trim(), m)
               break
            case 'babihutan':
               if (db.data.users[m.sender].babihutan >= count * 1) {
                  db.data.users[m.sender].money += Sbabihutan * count
                  db.data.users[m.sender].babihutan -= count * 1
                  conn.reply(m.chat, `Sukses Menjual ${count} Babi Hutan Dengan Harga ${Sbabihutan * count} Money `.trim(), m)
               } else conn.reply(m.chat, `Babi Hutan Kamu Tidak Cukup`.trim(), m)
               break
            case 'ayam':
               if (db.data.users[m.sender].ayam >= count * 1) {
                  db.data.users[m.sender].money += Sayam * count
                  db.data.users[m.sender].ayam -= count * 1
                  conn.reply(m.chat, `Sukses Menjual ${count} Ayam Dengan Harga ${Sayam * count} Money `.trim(), m)
               } else conn.reply(m.chat, `Ayam Kamu Tidak Cukup`.trim(), m)
               break
            //mancing
            case 'kepiting':
               if (db.data.users[m.sender].kepiting >= count * 1) {
                  db.data.users[m.sender].money += Skepiting * count
                  db.data.users[m.sender].kepiting -= count * 1
                  conn.reply(m.chat, `Sukses Menjual ${count} Kepiting Dengan Harga ${Skepiting * count} Money `.trim(), m)
               } else conn.reply(m.chat, `Kepiting Kamu Tidak Cukup`.trim(), m)
               break
            case 'ikan':
               if (db.data.users[m.sender].ikan >= count * 1) {
                  db.data.users[m.sender].money += Skepiting * count
                  db.data.users[m.sender].ikan -= count * 1
                  conn.reply(m.chat, `Sukses Menjual ${count} Ikan Dengan Harga ${Sikan * count} Money `.trim(), m)
               } else conn.reply(m.chat, `Ikan Kamu Tidak Cukup`.trim(), m)
               break
            case 'dory':
               if (db.data.users[m.sender].dory >= count * 1) {
                  db.data.users[m.sender].money += Sdory * count
                  db.data.users[m.sender].dory -= count * 1
                  conn.reply(m.chat, `Sukses Menjual ${count} Ikan Dory Dengan Harga ${Sdory * count} Money `.trim(), m)
               } else conn.reply(m.chat, `Ikan Dory Kamu Tidak Cukup`.trim(), m)
               break
            case 'gurita':
               if (db.data.users[m.sender].gurita >= count * 1) {
                  db.data.users[m.sender].money += Skepiting * count
                  db.data.users[m.sender].gurita -= count * 1
                  conn.reply(m.chat, `Sukses Menjual ${count} Gurita Dengan Harga ${Sgurita * count} Money `.trim(), m)
               } else conn.reply(m.chat, `Gurita Kamu Tidak Cukup`.trim(), m)
               break
            case 'buntal':
               if (db.data.users[m.sender].buntal >= count * 1) {
                  db.data.users[m.sender].money += Sbuntal * count
                  db.data.users[m.sender].buntal -= count * 1
                  conn.reply(m.chat, `Sukses Menjual ${count} Ikan Buntal Dengan Harga ${Sbuntal * count} Money `.trim(), m)
               } else conn.reply(m.chat, `Ikan Buntal Kamu Tidak Cukup`.trim(), m)
               break
            case 'hiu':
               if (db.data.users[m.sender].hiu >= count * 1) {
                  db.data.users[m.sender].money += Shiu * count
                  db.data.users[m.sender].hiu -= count * 1
                  conn.reply(m.chat, `Sukses Menjual ${count} Hiu Dengan Harga ${Shiu * count} Money `.trim(), m)
               } else conn.reply(m.chat, `Hiu Kamu Tidak Cukup`.trim(), m)
               break
            case 'orca':
               if (db.data.users[m.sender].orca >= count * 1) {
                  db.data.users[m.sender].money += Sorca * count
                  db.data.users[m.sender].orca -= count * 1
                  conn.reply(m.chat, `Sukses Menjual ${count} Paus Orca Dengan Harga ${Sorca * count} Money `.trim(), m)
               } else conn.reply(m.chat, `Paus Orca Kamu Tidak Cukup`.trim(), m)
               break
            case 'lumba':
               if (db.data.users[m.sender].lumba >= count * 1) {
                  db.data.users[m.sender].money += Skepiting * count
                  db.data.users[m.sender].lumba -= count * 1
                  conn.reply(m.chat, `Sukses Menjual ${count} Lumba Lumba Dengan Harga ${Slumba * count} Money `.trim(), m)
               } else conn.reply(m.chat, `Lumba Lumba Kamu Tidak Cukup`.trim(), m)
               break
            case 'paus':
               if (db.data.users[m.sender].paus >= count * 1) {
                  db.data.users[m.sender].money += Spaus * count
                  db.data.users[m.sender].paus -= count * 1
                  conn.reply(m.chat, `Sukses Menjual ${count} Paus Dengan Harga ${Spaus * count} Money `.trim(), m)
               } else conn.reply(m.chat, `Paus Kamu Tidak Cukup`.trim(), m)
               break
            case 'lobster':
               if (db.data.users[m.sender].lobster >= count * 1) {
                  db.data.users[m.sender].money += Slobster * count
                  db.data.users[m.sender].lobster -= count * 1
                  conn.reply(m.chat, `Sukses Menjual ${count} Lobster Dengan Harga ${Slobster * count} Money `.trim(), m)
               } else conn.reply(m.chat, `Lobster Kamu Tidak Cukup`.trim(), m)
               break
            case 'udang':
               if (db.data.users[m.sender].udang >= count * 1) {
                  db.data.users[m.sender].money += Sudang * count
                  db.data.users[m.sender].udang -= count * 1
                  conn.reply(m.chat, `Sukses Menjual ${count} Udang Dengan Harga ${Sudang * count} Money `.trim(), m)
               } else conn.reply(m.chat, `Udang Kamu Tidak Cukup`.trim(), m)
               break
            case 'cumi':
               if (db.data.users[m.sender].cumi >= count * 1) {
                  db.data.users[m.sender].money += Scumi * count
                  db.data.users[m.sender].cumi -= count * 1
                  conn.reply(m.chat, `Sukses Menjual ${count} Cumi Dengan Harga ${Scumi * count} Money `.trim(), m)
               } else conn.reply(m.chat, `Cumi Kamu Tidak Cukup`.trim(), m)
               break
            default:
               return conn.reply(m.chat, Kchat, m)
         }
      }
   } catch (e) {
      conn.reply(m.chat, Kchat, m)
      console.log(e)
   }
}

handler.help = ['pasar']
handler.tags = ['rpg']
handler.command = /^(pasar)$/i
handler.limit = handler.group = handler.register = 1
module.exports = handler