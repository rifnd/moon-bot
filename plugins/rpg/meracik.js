let handler = async (m, {
   conn,
   args,
   usedPrefix,
   command,
   text,
   Func
}) => {
   let timeoute = 1000
   let timeoutem = 60000
   let timeoutu = 600000
   let timeouto = 1000
   let timeouten = 60000
   let timeoutum = 600000
   let timeoutol = 1000
   let timeoutel = 60000
   let timeoutul = 600000
   let timeoutog = 1000
   let timeouteg = 60000
   let timeoutug = 600000
   let timeoutoy = 1000
   let timeoutey = 60000
   let timeoutuy = 600000
   let timeoutst = 1000
   let timeoutstt = 60000
   let timeoutsttt = 600000
   let timeoutww = 1000
   let timeoutwww = 60000
   let timeoutwwww = 600000
   let type = (args[0] || '').toLowerCase()
   switch (type) {
      case 'ramuan':
         let apelu = db.data.users[m.sender].apel
         let angguru = db.data.users[m.sender].anggur
         let manggau = db.data.users[m.sender].mangga
         let pisangu = db.data.users[m.sender].pisang
         let jeruku = db.data.users[m.sender].jeruk
         let __waktuga = (new Date - db.data.users[m.sender].lastramuanclaim)
         let _waktuga = (600000 - __waktuga)
         let waktuga = clockString(_waktuga)
         if (apelu == 0 || angguru == 0 || manggau == 0 || pisangu == 0 || jeruku == 0) return m.reply('*Pastikan kamu memiliki semua buah buahan*\n*Seperti Apel, Mangga, Jeruk, Pisang, Anggur*')
         if (new Date - db.data.users[m.sender].lastramuanclaim > 600000) {
            if (db.data.users[m.sender].mangga > 499) {
               if (db.data.users[m.sender].apel > 499) {
                  if (db.data.users[m.sender].pisang > 499) {
                     if (db.data.users[m.sender].jeruk > 499) {
                        if (db.data.users[m.sender].anggur > 499) {
                           let _manggas = `${Math.floor(Math.random() * 500)}`.trim()
                           let _anggurs = `${Math.floor(Math.random() * 500)}`.trim()
                           let _jeruks = `${Math.floor(Math.random() * 500)}`.trim()
                           let _apels = `${Math.floor(Math.random() * 500)}`.trim()
                           let _pisangs = `${Math.floor(Math.random() * 500)}`.trim()
                           let _ramuans = `${pickRandom(['1', '2', '3', '4', '5'])}`.trim()
                           let ramuans = (_ramuans * 1)
                           let manggas = (_manggas * 1)
                           let anggurs = (_anggurs * 1)
                           let jeruks = (_jeruks * 1)
                           let apels = (_apels * 1)
                           let pisangs = (_pisangs * 1)
                           db.data.users[m.sender].mangga -= manggas * 1
                           db.data.users[m.sender].anggur -= anggurs * 1
                           db.data.users[m.sender].jeruk -= jeruks * 1
                           db.data.users[m.sender].apel -= apels * 1
                           db.data.users[m.sender].pisang -= pisangs * 1
                           db.data.users[m.sender].ramuan += ramuans * 1
                           db.data.users[m.sender].lastramuanclaim = new Date * 1
                           let srcs = `
 Berhasil meracik ramuan :
 ◦ ${apels} Apel
 ◦ ${manggas} Mangga
 ◦ ${anggurs} Anggur
 ◦ ${jeruks} Jeruk
 ◦ ${pisangs} Pisang
 
 mendapatkan ramuan : 
 +${ramuans}
 `.trim()
                           setTimeout(() => {
                              //conn.reply(m.chat, 'Yuk meracik lagi..', m)
                           }, timeoutu)
                           setTimeout(() => {
                              conn.reply(m.chat, srcs, m)
                           }, timeoutem)
                           setTimeout(() => {
                              conn.reply(m.chat, 'Mohon tunggu sedang mengaduk ramuan', m)
                           }, timeoute)
                        } else m.reply(`Pastikan anggur kamu *500* untuk bisa meracik ramuan`)
                     } else m.reply(`Pastikan jeruk kamu *500* untuk bisa meracik ramuan`)
                  } else m.reply(`Pastikan pisang kamu *500* untuk bisa meracik ramuan`)
               } else m.reply(`Pastikan apel kamu *500* untuk bisa meracik ramuan`)
            } else m.reply(`Pastikan mangga kamu *500* untuk bisa meracik ramuan`)
         } else m.reply(`Kamu sudah meracik, tidak bisa meracik kembali..\nMohon tunggu ${waktuga} lagi untuk meracik kembali `)
         break
      /*case 'cupon':
                      let gemses = db.data.users[m.sender].gems 
                      let __waktutiones = (new Date - db.data.users[m.sender].lastgemsclaim)
                      let _waktutiones = (600000 - __waktutiones)
                      let waktutiones = clockString(_waktutiones)
                      if (gemses == 0) return m.reply('*Pastikan kamu memiliki gems*')
                      if (new Date - db.data.users[m.sender].lastgemsclaim > 600000) {
                      if (db.data.users[m.sender].gems > 1000000) {
                    //  let cupon = `${pickRandom(['1','1','1','1','1','2','1','1','1','1','1','2'])}`.trim()
                      db.data.users[m.sender].gems -= 1000000
                      db.data.users[m.sender].cupon += 1
                      db.data.users[m.sender].lastgemsclaim = new Date * 1
                      let gmss = `
  Berhasil meracik cupon:
  -1 Juta gems 
  
  Selamat kamu mendapatkan cupon:
  +1 Cupon
  `.trim()
                      conn.reply(m.chat, gmss, m)
                      } else m.reply('Pastikan kamu memiliki 1 Juta gems untuk bisa meracik cupon')
                   } else m.reply(`Kamu sudah meracik, tidak bisa meracik kembali..\nMohon tunggu ${waktutiones} lagi untuk meracik kembali `)
      break 
      case 'gems':
                      let eleksirbh = db.data.users[m.sender].eleksirb 
                      let __waktutioneso = (new Date - db.data.users[m.sender].lastgemsclaim)
                      let _waktutioneso = (600000 - __waktutioneso)
                      let waktutioneso = clockString(_waktutioneso)
                      if (eleksirbh == 0) return m.reply('*Pastikan kamu memiliki eleksir biru*')
                      if (new Date - db.data.users[m.sender].lastgemsclaim > 600000) {
                      if (db.data.users[m.sender].eleksirb > 10000) {
                      let _gemss = `${Math.floor(Math.random() * 500)}`.trim()
                      let gemss = (_gemss * 1)
                      db.data.users[m.sender].eleksirb -= 10000
                      db.data.users[m.sender].gems += gemss * 1
                      db.data.users[m.sender].lastgemsclaim = new Date * 1
                      let gamse = `
  Berhasil meracik gems:
  -10000 Eleksir Biru
  
  Selamat kamu mendapatkan gems:
  +${gemss} Gems
  `.trim()
                      setTimeout(() => {
                           conn.reply(m.chat, 'Yuk meracik lagi..', m)
                       }, 600000)
                      setTimeout(() => {
                           conn.reply(m.chat, gamse, m)
                       }, 30000)
                      setTimeout(() => {
                           conn.reply(m.chat, 'Mohon tunggu sedang mengaduk gems', m)
                       }, 0)
                       } else m.reply(`Pasti kan kamu memiliki eleksir biru 10000, untuk bisa meracik gems`)
                    } else m.reply(`Kamu sudah meracik, tidak bisa meracik kembali..\nMohon tunggu ${waktutioneso} lagi untuk meracik kembali `)
      break 
      case 'troops':
                      let pendudukkes = db.data.users[m.sender].penduduk 
                      let __waktutionkes = (new Date - db.data.users[m.sender].lastpotionclaim)
                      let _waktutionkes = (600000 - __waktutionkes)
                      let waktutionkes = clockString(_waktutionkes)
                      if (pendudukkes == 0) return m.reply('*Pastikan kamu memiliki penduduk untuk menjadikan prajurit*')
                      if (new Date - db.data.users[m.sender].lastpotionclaim > 600000) {
                      if (db.data.users[m.sender].penduduk > 9) {
                      db.data.users[m.sender].penduduk -= 10
                      db.data.users[m.sender].archer += 5
                      db.data.users[m.sender].shadow += 5
                      db.data.users[m.sender].lastpotionclaim = new Date * 1 
                      let cdskes = `
  Berhasil menukar pasukan:
  -10 Penduduk 
  +5 Archer
  +5 Shadow
  `.trim()
                      conn.reply(m.chat, cdskes, m)
                      } else m.reply(`Minimal penduduk kamu 10 untuk menukar sebuah pasukan`)
                   } else m.reply(`Kamu sudah meracik, tidak bisa meracik kembali..\nMohon tunggu ${waktutionkes} lagi untuk meracik kembali `)
      break 
      case 'penduduk':
                      let apeleks = db.data.users[m.sender].apel 
                      let anggureks = db.data.users[m.sender].anggur
                      let manggaeks = db.data.users[m.sender].mangga
                      let pisangeks = db.data.users[m.sender].pisang
                      let jerukeks = db.data.users[m.sender].jeruk 
                      let __waktuteks = (new Date - db.data.users[m.sender].lastpotionclaim)
                      let _waktuteks = (600000 - __waktuteks)
                      let waktuteks = clockString(_waktuteks)
                      if (apeleks == 0 || anggureks == 0 || manggaeks == 0 || pisangeks == 0 || jerukeks == 0) return m.reply('*Pastikan kamu memiliki semua buah buahan*\n*Seperti Apel, Mangga, Jeruk, Pisang, Anggur*')
                      if (new Date - db.data.users[m.sender].lastpotionclaim > 600000) {
                      if (db.data.users[m.sender].mangga > 499) {
                     if (db.data.users[m.sender].apel > 499) {
                     if (db.data.users[m.sender].pisang > 499) {
                     if (db.data.users[m.sender].jeruk > 499) {
                     if (db.data.users[m.sender].anggur > 499) {
                     let _manggaahs = `${Math.floor(Math.random() * 500)}`.trim()
                      let _apelahs = `${Math.floor(Math.random() * 500)}`.trim()
                      let _anggurahs = `${Math.floor(Math.random() * 500)}`.trim()
                      let _pisangahs = `${Math.floor(Math.random() * 500)}`.trim()
                      let _jerukahs = `${Math.floor(Math.random() * 500)}`.trim()
                      let _pendudukahs = `${Math.floor(Math.random() * 501)}`.trim()
                      let pendudukahs = (_pendudukahs * 1)
                      let manggaahs = (_manggaahs * 1)
                      let apelahs = (_apelahs * 1)
                      let anggurahs = (_anggurahs * 1)
                      let pisangahs = (_pisangahs * 1)
                      let jerukahs = (_jerukahs * 1)
                      db.data.users[m.sender].mangga -= manggaahs * 1
                      db.data.users[m.sender].anggur -= anggurahs * 1
                      db.data.users[m.sender].jeruk -= jerukahs * 1
                      db.data.users[m.sender].apel -= apelahs * 1
                      db.data.users[m.sender].pisang -= pisangahs * 1
                      db.data.users[m.sender].penduduk += pendudukahs * 1
                      db.data.users[m.sender].lastpotionclaim = new Date * 1 
                      let psnan = `
  Berhasil menghabiskan buah buahan:
  -${manggaahs} Mangga
  -${apelahs} Apel
  -${anggurahs} Anggur
  -${pisangahs} Pisang
  -${jerukahs} Jeruk
  
  Berhasil menambahkan penduduk:
  +${pendudukahs} Penduduk
  `.trim()
                      conn.reply(m.chat, psnan, m)
                       } else m.reply(`Pastikan anggur kamu *500* untuk bisa menambahkan penduduk`)
                    } else m.reply(`Pastikan jeruk kamu *500* untuk bisa menambahkan penduduk`)
                 } else m.reply(`Pastikan pisang kamu *500* untuk bisa menambahkan penduduk`)
              } else m.reply(`Pastikan apel kamu *500* untuk bisa menambahkan penduduk`)
           } else m.reply(`Pastikan mangga kamu *500* untuk bisa menambahkan penduduk`)
        } else m.reply(`Kamu sudah menambahkan penduduk, tidak bisa menambahkan penduduk kembali..\nMohon tunggu ${waktuteks} lagi untuk menambahkan penduduk kembali `)
      break*/
      case 'potion':
         let apele = db.data.users[m.sender].apel
         let anggure = db.data.users[m.sender].anggur
         let manggae = db.data.users[m.sender].mangga
         let pisange = db.data.users[m.sender].pisang
         let jeruke = db.data.users[m.sender].jeruk
         let __waktution = (new Date - db.data.users[m.sender].lastpotionclaim)
         let _waktution = (600000 - __waktution)
         let waktution = clockString(_waktution)
         if (apele == 0 || anggure == 0 || manggae == 0 || pisange == 0 || jeruke == 0) return m.reply('*Pastikan kamu memiliki semua buah buahan*\n*Seperti Apel, Mangga, Jeruk, Pisang, Anggur*')
         if (new Date - db.data.users[m.sender].lastpotionclaim > 600000) {
            if (db.data.users[m.sender].mangga > 499) {
               if (db.data.users[m.sender].apel > 499) {
                  if (db.data.users[m.sender].pisang > 499) {
                     if (db.data.users[m.sender].jeruk > 499) {
                        if (db.data.users[m.sender].anggur > 499) {
                           let _manggan = `${Math.floor(Math.random() * 500)}`.trim()
                           let _anggurn = `${Math.floor(Math.random() * 500)}`.trim()
                           let _jerukn = `${Math.floor(Math.random() * 500)}`.trim()
                           let _apeln = `${Math.floor(Math.random() * 500)}`.trim()
                           let _pisangn = `${Math.floor(Math.random() * 500)}`.trim()
                           let _potionn = `${pickRandom(['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'])}`.trim()
                           let potionn = (_potionn * 1)
                           let manggan = (_manggan * 1)
                           let anggurn = (_anggurn * 1)
                           let jerukn = (_jerukn * 1)
                           let apeln = (_apeln * 1)
                           let pisangn = (_pisangn * 1)
                           db.data.users[m.sender].mangga -= manggan * 1
                           db.data.users[m.sender].anggur -= anggurn * 1
                           db.data.users[m.sender].jeruk -= jerukn * 1
                           db.data.users[m.sender].apel -= apeln * 1
                           db.data.users[m.sender].pisang -= pisangn * 1
                           db.data.users[m.sender].potion += potionn * 1
                           db.data.users[m.sender].lastpotionclaim = new Date * 1
                           let srcn = `
 Berhasil meracik potion:
 -${apeln} Apel
 -${manggan} Mangga
 -${anggurn} Anggur
 -${jerukn} Jeruk
 -${pisangn} Pisang
 
 Selamat kamu mendapatkan potion: 
 +${potionn}
 `.trim()
                           setTimeout(() => {
                              conn.reply(m.chat, 'Yuk meracik lagi..', m)
                           }, timeoutum)
                           setTimeout(() => {
                              conn.reply(m.chat, srcn, m)
                           }, timeouten)
                           setTimeout(() => {
                              conn.reply(m.chat, 'Mohon tunggu sedang mengaduk potion', m)
                           }, timeouto)
                        } else m.reply(`Pastikan anggur kamu *500* untuk bisa meracik potion`)
                     } else m.reply(`Pastikan jeruk kamu *500* untuk bisa meracik potion`)
                  } else m.reply(`Pastikan pisang kamu *500* untuk bisa meracik potion`)
               } else m.reply(`Pastikan apel kamu *500* untuk bisa meracik potion`)
            } else m.reply(`Pastikan mangga kamu *500* untuk bisa meracik potion`)
         } else m.reply(`Kamu sudah meracik, tidak bisa meracik kembali..\nMohon tunggu ${waktution} lagi untuk meracik kembali `)
         break
      case 'string':
         let apelg = db.data.users[m.sender].apel
         let anggurg = db.data.users[m.sender].anggur
         let manggag = db.data.users[m.sender].mangga
         let pisangg = db.data.users[m.sender].pisang
         let jerukg = db.data.users[m.sender].jeruk
         let __waktutiong = (new Date - db.data.users[m.sender].laststringclaim)
         let _waktutiong = (600000 - __waktutiong)
         let waktutiong = clockString(_waktutiong)
         if (apelg == 0 || anggurg == 0 || manggag == 0 || pisangg == 0 || jerukg == 0) return m.reply('*Pastikan kamu memiliki semua buah buahan*\n*Seperti Apel, Mangga, Jeruk, Pisang, Anggur*')
         if (new Date - db.data.users[m.sender].laststringclaim > 600000) {
            if (db.data.users[m.sender].mangga > 499) {
               if (db.data.users[m.sender].apel > 499) {
                  if (db.data.users[m.sender].pisang > 499) {
                     if (db.data.users[m.sender].jeruk > 499) {
                        if (db.data.users[m.sender].anggur > 499) {
                           let _manggang = `${Math.floor(Math.random() * 500)}`.trim()
                           let _anggurng = `${Math.floor(Math.random() * 500)}`.trim()
                           let _jerukng = `${Math.floor(Math.random() * 500)}`.trim()
                           let _apelng = `${Math.floor(Math.random() * 500)}`.trim()
                           let _pisangng = `${Math.floor(Math.random() * 500)}`.trim()
                           let _strings = `${pickRandom(['1', '2', '3', '4'])}`.trim()
                           let strings = (_strings * 1)
                           let manggang = (_manggang * 1)
                           let anggurng = (_anggurng * 1)
                           let jerukng = (_jerukng * 1)
                           let apelng = (_apelng * 1)
                           let pisangng = (_pisangng * 1)
                           db.data.users[m.sender].mangga -= manggang * 1
                           db.data.users[m.sender].anggur -= anggurng * 1
                           db.data.users[m.sender].jeruk -= jerukng * 1
                           db.data.users[m.sender].apel -= apelng * 1
                           db.data.users[m.sender].pisang -= pisangng * 1
                           db.data.users[m.sender].string += strings * 1
                           db.data.users[m.sender].laststringclaim = new Date * 1
                           let srcng = `
 Berhasil meracik string:
 -${apelng} Apel
 -${manggang} Mangga
 -${anggurng} Anggur
 -${jerukng} Jeruk
 -${pisangng} Pisang
 
 Selamat kamu mendapatkan string: 
 +${strings}
 `.trim()
                           setTimeout(() => {
                              conn.reply(m.chat, 'Yuk meracik lagi..', m)
                           }, timeoutul)
                           setTimeout(() => {
                              conn.reply(m.chat, srcng, m)
                           }, timeoutel)
                           setTimeout(() => {
                              conn.reply(m.chat, 'Mohon tunggu sedang mengaduk string', m)
                           }, timeoutol)
                        } else m.reply(`Pastikan anggur kamu *500* untuk bisa meracik string`)
                     } else m.reply(`Pastikan jeruk kamu *500* untuk bisa meracik string`)
                  } else m.reply(`Pastikan pisang kamu *500* untuk bisa meracik string`)
               } else m.reply(`Pastikan apel kamu *500* untuk bisa meracik string`)
            } else m.reply(`Pastikan mangga kamu *500* untuk bisa meracik string`)
         } else m.reply(`Kamu sudah meracik, tidak bisa meracik kembali..\nMohon tunggu ${waktutiong} lagi untuk meracik kembali `)
         break
      case 'sword':
         let iron = db.data.users[m.sender].iron
         let kayu = db.data.users[m.sender].kayu
         let string = db.data.users[m.sender].string
         let __waktutions = (new Date - db.data.users[m.sender].lastswordclaim)
         let _waktutions = (600000 - __waktutions)
         let waktutions = clockString(_waktutions)
         if (iron == 0 || kayu == 0 || string == 0) return m.reply('*Pastikan kamu memiliki semua*\n*Seperti Iron, Kayu, String*')
         if (new Date - db.data.users[m.sender].lastswordclaim > 600000) {
            if (db.data.users[m.sender].iron > 4) {
               if (db.data.users[m.sender].kayu > 499) {
                  if (db.data.users[m.sender].string > 9) {
                     let _ironn = `${pickRandom(['1', '2', '3', '4'])}`.trim()
                     let _kayunn = `${Math.floor(Math.random() * 500)}`.trim()
                     let _stringn = `${pickRandom(['1', '2', '3', '4', '5', '6', '7', '8', '9'])}`.trim()
                     let _swordn = `${pickRandom(['1', '2'])}`.trim()
                     let swordn = (_swordn * 1)
                     let ironn = (_ironn * 1)
                     let kayun = (_kayunn * 1)
                     let stringn = (_stringn * 1)
                     db.data.users[m.sender].iron -= ironn * 1
                     db.data.users[m.sender].kayu -= kayun * 1
                     db.data.users[m.sender].string -= stringn * 1
                     db.data.users[m.sender].sword += swordn * 1
                     db.data.users[m.sender].lastswordclaim = new Date * 1
                     let srcngs = `
 Berhasil meracik sword:
 -${ironn} Iron
 -${kayun} Kayu
 -${stringn} String
 
 Selamat kamu mendapatkan sword: 
 +${swordn}
 `.trim()
                     setTimeout(() => {
                        conn.reply(m.chat, 'Yuk meracik lagi..', m)
                     }, timeoutug)
                     setTimeout(() => {
                        conn.reply(m.chat, srcngs, m)
                     }, timeouteg)
                     setTimeout(() => {
                        conn.reply(m.chat, 'Mohon tunggu sedang mengaduk sword', m)
                     }, timeoutog)
                  } else m.reply(`Pastikan string kamu *10* untuk bisa meracik sword`)
               } else m.reply(`Pastikan kayu kamu *500* untuk bisa meracik sword`)
            } else m.reply(`Pastikan iron kamu *5* untuk bisa meracik sword`)
         } else m.reply(`Kamu sudah meracik, tidak bisa meracik kembali..\nMohon tunggu ${waktutions} lagi untuk meracik kembali `)
         break
      case 'weapon':
         let ironw = db.data.users[m.sender].iron
         let kayuw = db.data.users[m.sender].kayu
         let stringw = db.data.users[m.sender].string
         let swordw = db.data.users[m.sender].sword
         let __waktutionsw = (new Date - db.data.users[m.sender].lastweaponclaim)
         let _waktutionsw = (600000 - __waktutionsw)
         let waktutionsw = clockString(_waktutionsw)
         if (ironw == 0 || kayuw == 0 || stringw == 0 || swordw == 0) return m.reply('*Pastikan kamu memiliki semua*\n*Seperti Iron, Kayu, String, Sword*')
         if (new Date - db.data.users[m.sender].lastweaponclaim > 600000) {
            if (db.data.users[m.sender].iron > 9) {
               if (db.data.users[m.sender].kayu > 999) {
                  if (db.data.users[m.sender].string > 9) {
                     if (db.data.users[m.sender].sword > 9) {
                        let _ironnw = `${pickRandom(['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'])}`.trim()
                        let _kayunnw = `${Math.floor(Math.random() * 1001)}`.trim()
                        let _stringnnw = `${pickRandom(['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'])}`.trim()
                        let _swordnnw = `${pickRandom(['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'])}`.trim()
                        //        let _weaponnw = `${pickRandom(['1','1','1','2','1','1','1','1','1','1','3'])}`.trim()
                        let swordnnw = (_swordnnw * 1)
                        let ironnw = (_ironnw * 1)
                        let kayunnw = (_kayunnw * 1)
                        let stringnnw = (_stringnnw * 1)
                        //          let weaponnw = (_weaponnw * 1)
                        db.data.users[m.sender].iron -= ironnw * 1
                        db.data.users[m.sender].kayu -= kayunnw * 1
                        db.data.users[m.sender].string -= stringnnw * 1
                        db.data.users[m.sender].sword -= swordnnw * 1
                        db.data.users[m.sender].weapon += 1
                        db.data.users[m.sender].lastweaponclaim = new Date * 1
                        let srcngsw = `
 Berhasil meracik weapon:
 -${ironnw} Iron
 -${kayunnw} Kayu
 -${stringnnw} String
 -${swordnnw} Sword
 
 Selamat kamu mendapatkan weapon: 
 +1
 `.trim()
                        setTimeout(() => {
                           conn.reply(m.chat, 'Yuk meracik lagi..', m)
                        }, timeoutwwww)
                        setTimeout(() => {
                           conn.reply(m.chat, srcngsw, m)
                        }, timeoutwww)
                        setTimeout(() => {
                           conn.reply(m.chat, 'Mohon tunggu sedang mengaduk weapon', m)
                        }, timeoutww)
                     } else m.reply(`Pastikan sword kamu *10* untuk bisa meracik weapon`)
                  } else m.reply(`Pastikan string kamu *10* untuk bisa meracik weapon`)
               } else m.reply(`Pastikan kayu kamu *1000* untuk bisa meracik weapon`)
            } else m.reply(`Pastikan iron kamu *10* untuk bisa meracik weapon`)
         } else m.reply(`Kamu sudah meracik, tidak bisa meracik kembali..\nMohon tunggu ${waktutionsw} lagi untuk meracik kembali `)
         break
      case 'iron':
         let emasbiasa = db.data.users[m.sender].emas
         let stringk = db.data.users[m.sender].string
         let __waktutionsk = (new Date - db.data.users[m.sender].lastsironclaim)
         let _waktutionsk = (600000 - __waktutionsk)
         let waktutionsk = clockString(_waktutionsk)
         if (emasbiasa == 0 || stringk == 0) return m.reply('*Pastikan kamu memiliki semua*\n*Seperti Emas, String*')
         if (new Date - db.data.users[m.sender].lastsironclaim > 600000) {
            if (db.data.users[m.sender].emas > 4) {
               if (db.data.users[m.sender].string > 4) {
                  let _emasbiasak = `${pickRandom(['1', '2', '3', '4'])}`.trim()
                  let _stringk = `${pickRandom(['1', '2', '3', '4'])}`.trim()
                  let _ironk = `${pickRandom(['1', '2'])}`.trim()
                  let ironk = (_ironk * 1)
                  let emasbiasak = (_emasbiasak * 1)
                  let stringk = (_stringk * 1)
                  db.data.users[m.sender].emas -= emasbiasak * 1
                  db.data.users[m.sender].string -= stringk * 1
                  db.data.users[m.sender].iron += ironk * 1
                  db.data.users[m.sender].lastsironclaim = new Date * 1
                  let srcngsk = `
 Berhasil meracik iron:
 -${emasbiasak} Emas
 -${stringk} String
 
 Selamat kamu mendapatkan iron: 
 +${ironk}
 `.trim()
                  setTimeout(() => {
                     conn.reply(m.chat, 'Yuk meracik lagi..', m)
                  }, timeoutuy)
                  setTimeout(() => {
                     conn.reply(m.chat, srcngsk, m)
                  }, timeoutey)
                  setTimeout(() => {
                     conn.reply(m.chat, 'Mohon tunggu sedang mengaduk iron', m)
                  }, timeoutoy)
               } else m.reply(`Pastikan string kamu *5* untuk bisa meracik iron`)
            } else m.reply(`Pastikan emas kamu *5* untuk bisa meracik iron`)
         } else m.reply(`Kamu sudah meracik, tidak bisa meracik kembali..\nMohon tunggu ${waktutionsk} lagi untuk meracik kembali `)
         break
      case 'pancingan':
         let kayuh = db.data.users[m.sender].kayu
         let stringh = db.data.users[m.sender].string
         let batuh = db.data.users[m.sender].batu
         let pancingan = db.data.users[m.sender].pancingan
         let __waktutionskh = (new Date - db.data.users[m.sender].lastsmancingclaim)
         let _waktutionskh = (600000 - __waktutionskh)
         let waktutionskh = clockString(_waktutionskh)
         if (kayuh == 0 || stringh == 0 || batuh == 0) return m.reply('*Pastikan kamu memiliki semua*\n*Seperti Kayu, Batu, String*')
         if (pancingan == 5) return m.reply('*Pancingan kamu dah lvl max*')
         if (new Date - db.data.users[m.sender].lastsmancingclaim > 600000) {
            if (db.data.users[m.sender].kayu > 499) {
               if (db.data.users[m.sender].string > 4) {
                  if (db.data.users[m.sender].batu > 9) {
                     db.data.users[m.sender].kayu -= 500
                     db.data.users[m.sender].string -= 5
                     db.data.users[m.sender].batu -= 10
                     db.data.users[m.sender].anakpancingan += 150
                     db.data.users[m.sender].lastsmancingclaim = new Date * 1
                     let srcngsk = `
 Berhasil meracik pancingan:
 -10 Batu
 -5 String
 -500 Kayu
 
 Selamat kamu mendapatkan Exp: 
 +150 Exp Pancingan
 `.trim()
                     setTimeout(() => {
                        conn.reply(m.chat, 'Yuk meracik lagi..', m)
                     }, timeoutuy)
                     setTimeout(() => {
                        conn.reply(m.chat, srcngsk, m)
                     }, timeoutey)
                     setTimeout(() => {
                        conn.reply(m.chat, 'Mohon tunggu sedang mengaduk pancingan', m)
                     }, timeoutoy)
                     if (pancingan > 0) {
                        let naiklvl = ((pancingan * 10000) - 1)
                        if (db.data.users[m.sender].anakpancingan > naiklvl) {
                           db.data.users[m.sender].pancingan += 1
                           db.data.users[m.sender].anakpancingan -= (pancingan * 10000)
                           conn.reply(m.chat, `*Selamat pancingan kamu naik level*`, m)
                        }
                     }
                  } else m.reply(`Pastikan batu kamu *10* untuk bisa meracik pancingan`)
               } else m.reply(`Pastikan string kamu *5* untuk bisa meracik pancingan`)
            } else m.reply(`Pastikan kayu kamu *500* untuk bisa meracik pancingan`)
         } else m.reply(`Kamu sudah meracik, tidak bisa meracik kembali..\nMohon tunggu ${waktutionskh} lagi untuk meracik kembali `)
         break
      default:
         return conn.reply(m.chat, `${usedPrefix + command} [ramuan | potion | string | iron | sword | weapon | pancingan]\nContoh penggunaan: *${usedPrefix + command} ramuan*`, m)
   }
}

handler.help = ['meracik']
handler.tags = ['rpg']
handler.command = /^(meracik|racik)$/i
handler.limit = handler.group = handler.rpg = handler.register = 1
module.exports = handler

function pickRandom(list) {
   return list[Math.floor(Math.random() * list.length)]
}

function clockString(ms) {
   let h = Math.floor(ms / 3600000)
   let m = Math.floor(ms / 60000) % 60
   let s = Math.floor(ms / 1000) % 60
   console.log({ ms, h, m, s })
   return [h, m, s].map(v => v.toString().padStart(2, 0)).join(':')
}