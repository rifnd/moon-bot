module.exports = (m, env) => {
   const isNumber = x => typeof x === 'number' && !isNaN(x)
   let user = global.db.data.users[m.sender]
   if (user) {
      if (!isNumber(user.exp)) user.exp = 1000
      if (!isNumber(user.limit)) user.limit = env.limit
      if (!isNumber(user.money)) user.money = 1000
      if (!isNumber(user.afk)) user.afk = -1
      if (!('afkReason' in user)) user.afkReason = ''
      if (!('afkObj' in user)) user.afkObj = {}
      if (!('banned' in user)) user.banned = false
      if (!isNumber(user.ban_temporary)) user.ban_temporary = 0
      if (!isNumber(user.ban_times)) user.ban_times = 0
      if (!('premium' in user)) user.premium = false
      if (!isNumber(user.expired)) user.expired = 0
      if (!isNumber(user.lastseen)) user.lastseen = 0
      if (!isNumber(user.hit)) user.hit = 0
      if (!isNumber(user.spam)) user.spam = 0
      if (!isNumber(user.warning)) user.warning = 0
      if (!isNumber(user.level)) user.level = 0
      if (!('role' in user)) user.role = 'Warrior V'
      if (!('registered' in user)) user.registered = false
      if (!('name' in user)) user.name = m.name
      if (!isNumber(user.age)) user.age = 0
      if (!isNumber(user.regTime)) user.regTime = 0
      if (!isNumber(user.snlast)) user.snlast = 0
      if (!isNumber(user.lasthourly)) user.lasthourly = 0
      if (!isNumber(user.lastclaim)) user.lastclaim = 0
      if (!isNumber(user.lastweekly)) user.lastweekly = 0
      if (!isNumber(user.lastmonthly)) user.lastmonthly = 0
      if (!isNumber(user.lastyearly)) user.lastyearly = 0

      /** rpg */
      if (!isNumber(user.health)) user.health = 100
      if (!isNumber(user.healtmonster)) user.healtmonster = 100
      if (!isNumber(user.armormonster)) user.armormonster = 0
      if (!isNumber(user.potion)) user.potion = 0
      if (!isNumber(user.expg)) user.expg = 0
      if (!isNumber(user.trash)) user.trash = 0
      if (!isNumber(user.sampah)) user.sampah = 0
      if (!isNumber(user.wood)) user.wood = 0
      if (!isNumber(user.rock)) user.rock = 0
      if (!isNumber(user.string)) user.string = 0
      if (!isNumber(user.petFood)) user.petFood = 0

      if (!isNumber(user.emerald)) user.emerald = 0
      if (!isNumber(user.coal)) user.coal = 0
      if (!isNumber(user.diamond)) user.diamond = 0
      if (!isNumber(user.berlian)) user.berlian = 0
      if (!isNumber(user.emas)) user.emas = 0
      if (!isNumber(user.gold)) user.gold = 0
      if (!isNumber(user.iron)) user.iron = 0
      if (!isNumber(user.string)) user.string = 0

      if (!isNumber(user.anggur)) user.anggur = 0
      if (!isNumber(user.jeruk)) user.jeruk = 0
      if (!isNumber(user.mangga)) user.mangga = 0
      if (!isNumber(user.apel)) user.apel = 0
      if (!isNumber(user.pisang)) user.pisang = 0
      if (!isNumber(user.bibitanggur)) user.bibitanggur = 0
      if (!isNumber(user.bibitjeruk)) user.bibitjeruk = 0
      if (!isNumber(user.bibitmangga)) user.bibitmangga = 0
      if (!isNumber(user.bibitapel)) user.bibitapel = 0
      if (!isNumber(user.bibitpisang)) user.bibitpisang = 0
      if (!isNumber(user.gardenboxs)) user.gardenboxs = 0
      if (!isNumber(user.spagety)) user.spagety = 0
      if (!isNumber(user.stamina)) user.stamina = 0
      if (!isNumber(user.bensin)) user.bensin = 0

      if (!isNumber(user.botol)) user.botol = 0
      if (!isNumber(user.kardus)) user.kardus = 0
      if (!isNumber(user.kaleng)) user.kaleng = 0
      if (!isNumber(user.aqua)) user.aqua = 0
      if (!isNumber(user.kayu)) user.kayu = 0
      if (!isNumber(user.batu)) user.batu = 0
      if (!isNumber(user.kapak)) user.kapak = 0
      if (!isNumber(user.obat)) user.obat = 0
      if (!isNumber(user.clan)) user.clan = 0
      if (!isNumber(user.pickaxe)) user.pickaxe = 0

      if (!isNumber(user.common)) user.common = 0
      if (!isNumber(user.cupon)) user.cupon = 0
      if (!isNumber(user.gems)) user.gems = 0
      if (!isNumber(user.boxs)) user.boxs = 0
      if (!isNumber(user.uncommon)) user.uncommon = 0
      if (!isNumber(user.mythic)) user.mythic = 0
      if (!isNumber(user.legendary)) user.legendary = 0
      if (!isNumber(user.pet)) user.pet = 0
      if (!isNumber(user.ramuan)) user.ramuan = 0

      if (!isNumber(user.lastramuanclaim)) user.lastramuanclaim = 0
      if (!isNumber(user.lastpotionclaim)) user.lastpotionclaim = 0
      if (!isNumber(user.laststringclaim)) user.laststringclaim = 0
      if (!isNumber(user.lastswordclaim)) user.lastswordclaim = 0
      if (!isNumber(user.lastsironclaim)) user.lastsironclaim = 0
      if (!isNumber(user.lastweaponclaim)) user.lastweaponclaim = 0
      if (!isNumber(user.lastsmancingclaim)) user.lastsmancingclaim = 0

      if (!isNumber(user.ramuannagalast)) user.ramuannagalast = 0
      if (!isNumber(user.ramuanrubahlast)) user.ramuanrubahlast = 0
      if (!isNumber(user.ramuankucinglast)) user.ramuankucinglast = 0
      if (!isNumber(user.ramuanserigalalast)) user.ramuanserigalalast = 0
      if (!isNumber(user.ramuangriffinlast)) user.ramuangriffinlast = 0
      if (!isNumber(user.ramuanphonixlast)) user.ramuanphonixlast = 0
      if (!isNumber(user.ramuancentaurlast)) user.ramuancentaurlast = 0
      if (!isNumber(user.ramuankudalast)) user.ramuankudalast = 0
      if (!isNumber(user.ramuankyubilast)) user.ramuankyubilast = 0
      if (!isNumber(user.ramuanherolast)) user.ramuanherolast = 0

      if (!isNumber(user.hero)) user.hero = 1
      if (!isNumber(user.exphero)) user.exphero = 0
      if (!isNumber(user.pillhero)) user.pillhero = 0
      if (!isNumber(user.herolastclaim)) user.herolastclaim = 0

      if (!isNumber(user.paus)) user.paus = 0
      if (!isNumber(user.kepiting)) user.kepiting = 0
      if (!isNumber(user.cumi)) user.cumi = 0
      if (!isNumber(user.gurita)) user.gurita = 0
      if (!isNumber(user.buntal)) user.buntal = 0
      if (!isNumber(user.dory)) user.dory = 0
      if (!isNumber(user.lobster)) user.lobster = 0
      if (!isNumber(user.lumba)) user.lumba = 0
      if (!isNumber(user.hiu)) user.hiu = 0
      if (!isNumber(user.ikan)) user.ikan = 0
      if (!isNumber(user.nila)) user.nila = 0
      if (!isNumber(user.lele)) user.lele = 0
      if (!isNumber(user.udang)) user.udang = 0
      if (!isNumber(user.orca)) user.orca = 0
      if (!isNumber(user.umpan)) user.umpan = 0
      if (!isNumber(user.pancingan)) user.pancingan = 1
      if (!isNumber(user.anakpancingan)) user.anakpancingan = 0
      if (!isNumber(user.lastmancingeasy)) user.lastmancingeasy = 0
      if (!isNumber(user.lastmancingnormal)) user.lastmancingnormal = 0
      if (!isNumber(user.lastmancinghard)) user.lastmancinghard = 0
      if (!isNumber(user.lastmancingextreme)) user.lastmancingextreme = 0

      if (!isNumber(user.kucing)) user.kucing = 0
      if (!isNumber(user.kucinglastclaim)) user.kucinglastclaim = 0
      if (!isNumber(user.kuda)) user.kuda = 0
      if (!isNumber(user.kudalastclaim)) user.kudalastclaim = 0
      if (!isNumber(user.rubah)) user.rubah = 0
      if (!isNumber(user.rubahlastclaim)) user.rubahlastclaim = 0
      if (!isNumber(user.anjing)) user.anjing = 0
      if (!isNumber(user.anjinglastclaim)) user.anjinglastclaim = 0
      if (!isNumber(user.serigala)) user.serigala = 0
      if (!isNumber(user.serigalalastclaim)) user.serigalalastclaim = 0
      if (!isNumber(user.naga)) user.naga = 0
      if (!isNumber(user.nagalastclaim)) user.nagalastclaim = 0
      if (!isNumber(user.phonix)) user.phonix = 0
      if (!isNumber(user.phonixlastclaim)) user.phonixlastclaim = 0
      if (!isNumber(user.kyubi)) user.kyubi = 0
      if (!isNumber(user.kyubilastclaim)) user.kyubilastclaim = 0
      if (!isNumber(user.griffin)) user.griffin = 0
      if (!isNumber(user.griffinlastclaim)) user.griffinlastclaim = 0
      if (!isNumber(user.centaur)) user.centaur = 0
      if (!isNumber(user.centaurlastclaim)) user.centaurlastclaim = 0

      if (!isNumber(user.anakkucing)) user.anakkucing = 0
      if (!isNumber(user.anakkuda)) user.anakkuda = 0
      if (!isNumber(user.anakrubah)) user.anakrubah = 0
      if (!isNumber(user.anakanjing)) user.anakanjing = 0
      if (!isNumber(user.anakserigala)) user.anakserigala = 0
      if (!isNumber(user.anaknaga)) user.anaknaga = 0
      if (!isNumber(user.anakphonix)) user.anakphonix = 0
      if (!isNumber(user.anakkyubi)) user.anakkyubi = 0
      if (!isNumber(user.anakgriffin)) user.anakgriffin = 0
      if (!isNumber(user.anakcentaur)) user.anakcentaur = 0

      if (!isNumber(user.makananpet)) user.makananpet = 0
      if (!isNumber(user.makanannaga)) user.makanannaga = 0
      if (!isNumber(user.makananphonix)) user.makananphonix = 0
      if (!isNumber(user.makanangriffin)) user.makanangriffin = 0
      if (!isNumber(user.makanankyubi)) user.makanankyubi = 0
      if (!isNumber(user.makanancentaur)) user.makanancentaur = 0

      if (!isNumber(user.horse)) user.horse = 0
      if (!isNumber(user.horseexp)) user.horseexp = 0
      if (!isNumber(user.cat)) user.cat = 0
      if (!isNumber(user.catexp)) user.catexp = 0
      if (!isNumber(user.fox)) user.fox = 0
      if (!isNumber(user.foxhexp)) user.foxexp = 0
      if (!isNumber(user.dog)) user.dog = 0
      if (!isNumber(user.dogexp)) user.dogexp = 0

      if (!isNumber(user.horselastfeed)) user.horselastfeed = 0
      if (!isNumber(user.catlastfeed)) user.catlastfeed = 0
      if (!isNumber(user.foxlastfeed)) user.foxlastfeed = 0
      if (!isNumber(user.doglastfeed)) user.doglastfeed = 0

      if (!isNumber(user.armor)) user.armor = 0
      if (!isNumber(user.armordurability)) user.armordurability = 0
      if (!isNumber(user.weapon)) user.weapon = 0
      if (!isNumber(user.weapondurability)) user.weapondurability = 0
      if (!isNumber(user.sword)) user.sword = 0
      if (!isNumber(user.sworddurability)) user.sworddurability = 0
      if (!isNumber(user.pickaxe)) user.pickaxe = 0
      if (!isNumber(user.pickaxedurability)) user.pickaxedurability = 0
      if (!isNumber(user.fishingrod)) user.fishingrod = 0
      if (!isNumber(user.fishingroddurability)) user.fishingroddurability = 0

      if (!isNumber(user.kerjasatu)) user.kerjasatu = 0
      if (!isNumber(user.kerjadua)) user.kerjadua = 0
      if (!isNumber(user.kerjatiga)) user.kerjatiga = 0
      if (!isNumber(user.kerjaempat)) user.kerjaempat = 0
      if (!isNumber(user.kerjalima)) user.kerjalima = 0
      if (!isNumber(user.kerjaenam)) user.kerjaenam = 0
      if (!isNumber(user.kerjatujuh)) user.kerjatujuh = 0
      if (!isNumber(user.kerjadelapan)) user.kerjadelapan = 0
      if (!isNumber(user.kerjasembilan)) user.kerjasembilan = 0
      if (!isNumber(user.kerjasepuluh)) user.kerjasepuluh = 0
      if (!isNumber(user.kerjasebelas)) user.kerjasebelas = 0
      if (!isNumber(user.kerjaduabelas)) user.kerjaduabelas = 0
      if (!isNumber(user.kerjatigabelas)) user.kerjatigabelas = 0
      if (!isNumber(user.kerjaempatbelas)) user.kerjaempatbelas = 0
      if (!isNumber(user.kerjalimabelas)) user.kerjalimabelas = 0
      if (!isNumber(user.kerjaenambelas)) user.kerjaenambelas = 0
      if (!isNumber(user.kerjatujuhbelas)) user.kerjatujuhbelas = 0
      if (!isNumber(user.kerjadelapanbelas)) user.kerjadelapanbelas = 0
      if (!isNumber(user.kerjasembilanbelas)) user.kerjasembilanbelas = 0
      if (!isNumber(user.kerjaduapuluh)) user.kerjaduapuluh = 0
      if (!isNumber(user.kerjaduasatu)) user.kerjaduasatu = 0
      if (!isNumber(user.kerjaduadua)) user.kerjaduadua = 0
      if (!isNumber(user.kerjaduatiga)) user.kerjaduatiga = 0
      if (!isNumber(user.kerjaduaempat)) user.kerjaduaempat = 0
      if (!isNumber(user.kerjadualima)) user.kerjadualima = 0
      if (!isNumber(user.kerjaduaenam)) user.kerjaduaenam = 0
      if (!isNumber(user.kerjaduatujuh)) user.kerjaduatujuh = 0
      if (!isNumber(user.kerjaduadelapan)) user.kerjaduadelapan = 0
      if (!isNumber(user.kerjaduasembilan)) user.kerjaduasembilan = 0
      if (!isNumber(user.kerjatigapuluh)) user.kerjatigapuluh = 0

      if (!isNumber(user.judilast)) user.judilast = 0
      if (!isNumber(user.reglast)) user.reglast = 0
      if (!isNumber(user.unreglast)) user.unreglast = 0
      if (!isNumber(user.unereglast)) user.unereglast = 0
      if (!isNumber(user.ereglast)) user.ereglast = 0
      if (!isNumber(user.snlast)) user.snlast = 0
      if (!isNumber(user.spinlast)) user.spinlast = 0

      if (!isNumber(user.ojek)) user.ojek = 0

      if (!isNumber(user.lastwarpet)) user.lastwarpet = 0
      if (!isNumber(user.lastspam)) user.lastspam = 0
      if (!isNumber(user.lastpekerjaan)) user.lastpekerjaan = 0
      if (!isNumber(user.lastclaim)) user.lastclaim = 0
      if (!isNumber(user.lastadventure)) user.lastadventure = 0
      if (!isNumber(user.lastgoplanet)) user.lastgoplanet = 0
      if (!isNumber(user.lastfishing)) user.lastfishing = 0
      if (!isNumber(user.lastdungeon)) user.lastdungeon = 0
      if (!isNumber(user.lastcrusade)) user.lastcrusade = 0
      if (!isNumber(user.lastduel)) user.lastduel = 0
      if (!isNumber(user.lastcode)) user.lastcode = 0
      if (!isNumber(user.lastlink)) user.lastlink = 0
      if (!isNumber(user.lastrob)) user.lastrob = 0
      if (!isNumber(user.lastopen)) user.lastopen = 0
      if (!isNumber(user.lasteasy)) user.lasteasy = 0
      if (!isNumber(user.lastnambang)) user.lastnambang = 0
      if (!isNumber(user.lastbunuhi)) user.lastbunuhi = 0
      if (!isNumber(user.lastmining)) user.lastmining = 0
      if (!isNumber(user.lasthunt)) user.lasthunt = 0
      if (!isNumber(user.lastweekly)) user.lastweekly = 0
      if (!isNumber(user.lastmonthly)) user.lastmonthly = 0
      if (!isNumber(user.lastmulung)) user.lastmulung = 0
      if (!isNumber(user.lastdagang)) user.lastdagang = 0
      if (!isNumber(user.lastnebang)) user.lastnebang = 0
      if (!isNumber(user.lastberkebon)) user.lastberkebon = 0
      if (!isNumber(user.lastadventure)) user.lastadventure = 0
      if (!isNumber(user.lastgoplanet)) user.lastgoplanet = 0
      if (!isNumber(user.lastberburu)) user.lastberburu = 0
      if (!isNumber(user.lastngojek)) user.lastngojek = 0
   } else {
      global.db.data.users[m.sender] = {
         exp: 1000,
         limit: env.limit,
         money: 1000,
         afk: -1,
         afkReason: '',
         afkObj: {},
         banned: false,
         ban_temporary: 0,
         ban_times: 0,
         premium: false,
         expired: 0,
         lastseen: 0,
         hit: 0,
         spam: 0,
         warning: 0,
         level: 0,
         role: 'Warrior V',
         registered: false,
         name: m.name,
         age: 0,
         regTime: 0,
         snlast: 0,
         lasthourly: 0,
         lastclaim: 0,
         lastweekly: 0,
         lastmonthly: 0,
         lastyearly: 0,

         /** rpg */
         health: 100,
         healtmonster: 100,
         armormonster: 0,
         potion: 0,
         expg: 0,
         trash: 0,
         sampah: 0,
         wood: 0,
         rock: 0,
         string: 0,
         petFood: 0,

         emerald: 0,
         coal: 0,
         diamond: 0,
         berlian: 0,
         emas: 0,
         gold: 0,
         iron: 0,
         string: 0,

         anggur: 0,
         jeruk: 0,
         mangga: 0,
         apel: 0,
         pisang: 0,
         bibitanggur: 0,
         bibitjeruk: 0,
         bibitmangga: 0,
         bibitapel: 0,
         bibitpisang: 0,
         gardenboxs: 0,
         spagety: 0,
         stamina: 0,
         bensin: 0,

         botol: 0,
         kardus: 0,
         kaleng: 0,
         aqua: 0,
         kayu: 0,
         batu: 0,
         kapak: 0,
         obat: 0,
         clan: 0,
         pickaxe: 0,

         common: 0,
         cupon: 0,
         gems: 0,
         boxs: 0,
         uncommon: 0,
         mythic: 0,
         legendary: 0,
         pet: 0,
         ramuan: 0,

         lastramuanclaim: 0,
         lastpotionclaim: 0,
         laststringclaim: 0,
         lastswordclaim: 0,
         lastsironclaim: 0,
         lastweaponclaim: 0,
         lastsmancingclaim: 0,

         ramuannagalast: 0,
         ramuanrubahlast: 0,
         ramuankucinglast: 0,
         ramuanserigalalast: 0,
         ramuangriffinlast: 0,
         ramuanphonixlast: 0,
         ramuancentaurlast: 0,
         ramuankudalast: 0,
         ramuankyubilast: 0,
         ramuanherolast: 0,

         hero: 1,
         exphero: 0,
         pillhero: 0,
         herolastclaim: 0,

         paus: 0,
         kepiting: 0,
         cumi: 0,
         gurita: 0,
         buntal: 0,
         dory: 0,
         lobster: 0,
         lumba: 0,
         hiu: 0,
         ikan: 0,
         nila: 0,
         lele: 0,
         udang: 0,
         orca: 0,
         umpan: 0,
         pancingan: 1,
         anakpancingan: 0,
         lastmancingeasy: 0,
         lastmancingnormal: 0,
         lastmancinghard: 0,
         lastmancingextreme: 0,

         kucing: 0,
         kucinglastclaim: 0,
         kuda: 0,
         kudalastclaim: 0,
         rubah: 0,
         rubahlastclaim: 0,
         anjing: 0,
         anjinglastclaim: 0,
         serigala: 0,
         serigalalastclaim: 0,
         naga: 0,
         nagalastclaim: 0,
         phonix: 0,
         phonixlastclaim: 0,
         kyubi: 0,
         kyubilastclaim: 0,
         griffin: 0,
         griffinlastclaim: 0,
         centaur: 0,
         centaurlastclaim: 0,

         anakkucing: 0,
         anakkuda: 0,
         anakrubah: 0,
         anakanjing: 0,
         anakserigala: 0,
         anaknaga: 0,
         anakphonix: 0,
         anakkyubi: 0,
         anakgriffin: 0,
         anakcentaur: 0,

         makananpet: 0,
         makanannaga: 0,
         makananphonix: 0,
         makanangriffin: 0,
         makanankyubi: 0,
         makanancentaur: 0,

         horse: 0,
         horseexp: 0,
         cat: 0,
         catexp: 0,
         fox: 0,
         foxexp: 0,
         dog: 0,
         dogexp: 0,

         horselastfeed: 0,
         catlastfeed: 0,
         foxlastfeed: 0,
         doglastfeed: 0,

         armor: 0,
         armordurability: 0,
         weapon: 0,
         weapondurability: 0,
         sword: 0,
         sworddurability: 0,
         pickaxe: 0,
         pickaxedurability: 0,
         fishingrod: 0,
         fishingroddurability: 0,

         kerjasatu: 0,
         kerjadua: 0,
         kerjatiga: 0,
         kerjaempat: 0,
         kerjalima: 0,
         kerjaenam: 0,
         kerjatujuh: 0,
         kerjadelapan: 0,
         kerjasembilan: 0,
         kerjasepuluh: 0,
         kerjasebelas: 0,
         kerjaduabelas: 0,
         kerjatigabelas: 0,
         kerjaempatbelas: 0,
         kerjalimabelas: 0,
         kerjaenambelas: 0,
         kerjatujuhbelas: 0,
         kerjadelapanbelas: 0,
         kerjasembilanbelas: 0,
         kerjaduapuluh: 0,
         kerjaduasatu: 0,
         kerjaduadua: 0,
         kerjaduatiga: 0,
         kerjaduaempat: 0,
         kerjadualima: 0,
         kerjaduaenam: 0,
         kerjaduatujuh: 0,
         kerjaduadelapan: 0,
         kerjaduasembilan: 0,
         kerjatigapuluh: 0,

         judilast: 0,
         reglast: 0,
         unreglast: 0,
         unereglast: 0,
         ereglast: 0,
         snlast: 0,
         spinlast: 0,

         ojek: 0,

         lastwarpet: 0,
         lastspam: 0,
         lastpekerjaan: 0,
         lastclaim: 0,
         lastadventure: 0,
         lastgoplanet: 0,
         lastfishing: 0,
         lastdungeon: 0,
         lastcrusade: 0,
         lastduel: 0,
         lastcode: 0,
         lastlink: 0,
         lastrob: 0,
         lastopen: 0,
         lasteasy: 0,
         lastnambang: 0,
         lastbunuhi: 0,
         lastmining: 0,
         lasthunt: 0,
         lastweekly: 0,
         lastmonthly: 0,
         lastmulung: 0,
         lastdagang: 0,
         lastnebang: 0,
         lastberkebon: 0,
         lastadventure: 0,
         lastgoplanet: 0,
         lastberburu: 0,
         lastngojek: 0,
      }
   }

   if (m.isGroup) {
      let group = global.db.data.groups[m.chat]
      if (group) {
         if (!isNumber(group.activity)) group.activity = 0
         if (!('isBanned' in group)) group.isBanned = false
         if (!('welcome' in group)) group.welcome = false
         if (!('sWelcome' in group)) group.sWelcome = ''
         if (!('sBye' in group)) group.sBye = ''
         if (!('detect' in group)) group.detect = false
         if (!('sPromote' in group)) group.sPromote = ''
         if (!('sDemote' in group)) group.sDemote = ''
         if (!('antidelete' in group)) group.antidelete = false
         if (!('antilink' in group)) group.antilink = false
         if (!('antivirtex' in group)) group.antivirtex = false
         if (!('autosticker' in group)) group.autosticker = false
         if (!('antisticker' in group)) group.antisticker = false
         if (!('viewonce' in group)) group.viewonce = false
         if (!('filter' in group)) group.filter = false
         if (!('member' in group)) group.member = {}
         if (!isNumber(group.expired)) group.expired = 0
         if (!('stay' in group)) group.stay = {}
      } else {
         global.db.data.groups[m.chat] = {
            activity: 0,
            isBanned: false,
            welcome: false,
            sWelcome: '',
            sBye: '',
            detect: false,
            sPromote: '',
            sDemote: '',
            antidelete: false,
            antilink: false,
            antivirtex: false,
            autosticker: false,
            viewonce: false,
            filter: false,
            member: {},
            expired: 0,
            stay: false
         }
      }
   }

   let chat = global.db.data.chats[m.chat]
   if (chat) {
      if (!isNumber(chat.chat)) chat.chat = 0
      if (!isNumber(chat.lastchat)) chat.lastchat = 0
      if (!isNumber(chat.command)) chat.command = 0
   } else {
      global.db.data.chats[m.chat] = {
         chat: 0,
         lastchat: 0,
         command: 0
      }
   }

   let setting = global.db.data.setting
   if (setting) {
      if (!('anticall' in setting)) setting.anticall = false
      if (!('chatbot' in setting)) setting.chatbot = false
      if (!('levelup' in setting)) setting.levelup = false
      if (!('self' in setting)) setting.self = false
      if (!('online' in setting)) setting.online = false
      if (!('antispam' in setting)) setting.antispam = false
      if (!('debug' in setting)) setting.debug = false
      if (!('groupmode' in setting)) setting.groupmode = false
      if (!('privatemode' in setting)) setting.privatemode = false
      if (!('game' in setting)) setting.game = false
      if (!('rpg' in setting)) setting.rpg = false
      if (!('noprefix' in setting)) setting.noprefix = false
      if (!('onlyprefix' in setting)) setting.onlyprefix = '.'
      if (!('hidden' in setting)) setting.hidden = []
      if (!isNumber(setting.lastReset)) setting.lastReset = new Date * 1
      if (!('sk_pack' in setting)) setting.sk_pack = 'Sticker by'
      if (!('sk_author' in setting)) setting.sk_author = '© moon-bot'
      if (!('toxic' in setting)) setting.toxic = ['kontol', 'memek', 'jembot', 'peli', 'jembot', 'jancok', 'ancok', 'gancok', 'dancok', 'bajingan', 'tempek', 'kirek', 'raimu', 'bangsat', 'turok', 'pukimak', 'telaso', 'bawok', 'bacot', 'biadap', 'biadab', 'bego', 'fuck', 'bokep', 'coli', 'colmek', 'comli', 'kanjut', 'tolol']
      if (!('owners' in setting)) setting.owners = ['6281252848955', '6285815700861']
      if (!('msg' in setting)) setting.msg = 'Hi +tag 🪸\nI am an automated system (WhatsApp Bot) that can help to do something, search and get data / information only through WhatsApp.\n\n◦ *Database* : +db\n◦ *Library* : Baileys\n◦ *Rest API* : https://api.alyachan.dev\n◦ *Source* : https://github.com/rifnd/moon-bot\n\nIf you find an error or want to upgrade premium plan contact the owner.'
      if (!isNumber(setting.style)) setting.style = 1
      if (!('cover' in setting)) setting.cover = 'https://telegra.ph/file/214d09bfb0e5c9b772e8a.jpg'
      if (!('link' in setting)) setting.link = 'https://whatsapp.com/channel/0029Va9dXn43mFY0QpulQ60K'
   } else {
      global.db.data.setting = {
         anticall: false,
         chatbot: false,
         levelup: false,
         self: false,
         online: false,
         antispam: false,
         debug: false,
         groupmode: false,
         privatemode: false,
         game: false,
         rpg: false,
         noprefix: false,
         onlyprefix: '.',
         hidden: [],
         lastReset: new Date * 1,
         sk_pack: 'Sticker by',
         sk_author: '© moon-bot',
         toxic: ['kontol', 'memek', 'jembot', 'peli', 'jembot', 'jancok', 'ancok', 'gancok', 'dancok', 'bajingan', 'tempek', 'kirek', 'raimu', 'bangsat', 'turok', 'pukimak', 'telaso', 'bawok', 'bacot', 'biadap', 'biadab', 'bego', 'fuck', 'bokep', 'coli', 'colmek', 'comli', 'kanjut', 'tolol'],
         owners: ['6281252848955', '6285815700861'],
         msg: 'Hi +tag 🪸\nI am an automated system (WhatsApp Bot) that can help to do something, search and get data / information only through WhatsApp.\n\n◦ *Database* : +db\n◦ *Library* : Baileys\n◦ *Rest API* : https://api.alyachan.dev\n◦ *Source* : https://github.com/rifnd/moon-bot\n\nIf you find an error or want to upgrade premium plan contact the owner.',
         style: 1,
         cover: 'https://telegra.ph/file/214d09bfb0e5c9b772e8a.jpg',
         link: 'https://whatsapp.com/channel/0029Va9dXn43mFY0QpulQ60K'
      }
   }
}