let handler = async (m, {
   conn,
   command,
   args,
   usedPrefix,
   env,
   Func
}) => {
   const jobs = { ojek: [{ name: 'Ojek', task: '🛵 Mengantarkan penumpang', difficulty: Func.random(['Noob', 'Easy', 'Normal']), money: Func.randomInt(env.min_reward, env.max_reward), exp: Func.randomInt(env.min_reward, env.max_reward) }], pedagang: [{ name: 'Pedagang', task: '🛒 Mencari pembeli', difficulty: Func.random(['Noob', 'Easy', 'Normal']), money: Func.randomInt(env.min_reward, env.max_reward), exp: Func.randomInt(env.min_reward, env.max_reward) }], dokter: [{ name: 'Dokter', task: '💉 Merawat pasien', difficulty: Func.random(['Easy', 'Normal', 'Hard']), money: Func.randomInt(env.min_reward, env.max_reward), exp: Func.randomInt(env.min_reward, env.max_reward) }], petani: [{ name: 'Petani', task: '🌾 Menanam dan memanen tanaman', difficulty: Func.random(['Noob', 'Easy', 'Normal']), money: Func.randomInt(env.min_reward, env.max_reward), exp: Func.randomInt(env.min_reward, env.max_reward) }], montir: [{ name: 'Montir', task: '🔧 Memperbaiki kendaraan', difficulty: Func.random(['Easy', 'Normal', 'Hard']), money: Func.randomInt(env.min_reward, env.max_reward), exp: Func.randomInt(env.min_reward, env.max_reward) }], kuli: [{ name: 'Kuli', task: '🏋️ Membantu proyek konstruksi', difficulty: 'Extreme', money: Func.randomInt(env.min_reward, env.max_reward), exp: Func.randomInt(env.min_reward, env.max_reward) }], gamer: [{ name: 'Gamer', task: '🎮 Main game dan streaming', difficulty: Func.random(['Noob', 'Easy', 'Normal', 'Hard']), money: Func.randomInt(env.min_reward, env.max_reward), exp: Func.randomInt(env.min_reward, env.max_reward) }], teacher: [{ name: 'Teacher', task: '👩‍🏫 Mengajar dan memberi pembelajaran', difficulty: Func.random(['Noob', 'Easy', 'Normal', 'Hard']), money: Func.randomInt(env.min_reward, env.max_reward), exp: Func.randomInt(env.min_reward, env.max_reward) }], designer: [{ name: 'Graphic Designer', task: '🎨 Membuat desain grafis', difficulty: Func.random(['Easy', 'Normal', 'Hard']), money: Func.randomInt(env.min_reward, env.max_reward), exp: Func.randomInt(env.min_reward, env.max_reward) }] }
   const taskInformation = {
      '🌾 Menanam dan memanen tanaman': ['Telah menanam jagung sebanyak 100 batang.', 'Berhasil memanen 50 kg tomat dengan hasil bagus.', 'Menanggulangi hama dan penyakit pada tanaman dengan sukses.', 'Menciptakan varietas baru tanaman yang unggul.', 'Mengikuti pelatihan pertanian terkemuka untuk meningkatkan keterampilan.'],
      '🛒 Mencari pembeli': ['Mendapatkan pelanggan setia yang selalu membeli produk.', 'Mengadakan diskon besar-besaran untuk menarik pembeli.', 'Mendapat penawaran untuk bekerja sama dengan toko besar.', 'Mengembangkan strategi pemasaran yang efektif untuk meningkatkan penjualan.', 'Mendapatkan testimoni positif dari banyak pelanggan.'],
      '💉 Merawat pasien': ['Menyembuhkan penyakit langka yang tidak bisa disembuhkan sebelumnya.', 'Menyelamatkan nyawa seorang pasien dalam kondisi kritis.', 'Dapat diagnosis yang tepat dan memberikan terapi yang efektif.', 'Menjadi bagian dari tim medis yang berhasil melakukan operasi sulit.', 'Menjadi pembicara utama dalam konferensi medis internasional.'],
      '🔧 Memperbaiki kendaraan': ['Berhasil memperbaiki mobil mewah milik selebriti terkenal.', 'Menyelesaikan perbaikan motor dalam waktu singkat.', 'Dapat menemukan dan mengatasi masalah yang rumit pada kendaraan.', 'Mengembangkan prototipe baru untuk kendaraan yang lebih efisien.', 'Memperoleh sertifikat dari produsen kendaraan terkemuka untuk keahliannya.'],
      '🛵 Mengantarkan penumpang': ['Menyelesaikan banyak perjalanan dalam waktu singkat.', 'Membawa penumpang ke tujuan dengan aman dan tepat waktu.', 'Mendapat review positif dari banyak penumpang.', 'Menghadapi situasi darurat dengan tenang dan penuh tanggung jawab.', 'Memiliki rute pilihan yang efisien untuk menghindari kemacetan.'],
      '🏋️ Membantu proyek konstruksi': ['Berpartisipasi dalam proyek konstruksi terbesar di kota.', 'Menyelesaikan pekerjaan berat dengan kecepatan tinggi.', 'Bekerja dengan tim yang solid untuk mencapai target proyek.', 'Menghadapi tantangan fisik dalam kondisi cuaca ekstrem.', 'Menemukan solusi inovatif untuk efisiensi konstruksi.'],
      '🎮 Main game dan streaming': ['Mencapai prestasi tertinggi di dalam game populer.', 'Mendapatkan banyak penonton dan donasi saat streaming.', 'Menjadi pemain profesional dan berkompetisi di turnamen besar.', 'Menciptakan komunitas gamer yang aktif dan positif.', 'Mengumpulkan sponsor untuk mendukung karier sebagai gamer.'],
      '👩‍🏫 Mengajar dan memberi pembelajaran': ['Meningkatkan hasil belajar siswa secara signifikan.', 'Mendapatkan penghargaan sebagai guru terbaik di sekolah.', 'Menjadi sumber inspirasi bagi murid-muridnya dan memotivasi mereka untuk sukses.', 'Mengembangkan program pembelajaran inovatif yang disukai siswa.', 'Mengadakan seminar edukatif untuk meningkatkan kualitas pendidikan.'],
      '🎨 Membuat desain grafis': ['Menghasilkan desain logo yang menarik untuk perusahaan ternama.', 'Membuat ilustrasi digital untuk buku anak-anak yang mendapat banyak pujian.', 'Mendesain kampanye iklan yang sukses dan mendapat banyak perhatian.', 'Berpartisipasi dalam proyek animasi yang mendapatkan penghargaan.', 'Menjalin kerja sama dengan selebriti untuk menciptakan konten visual.']
   }
   let type = (args[0] || '').toLowerCase()
   let user = db.data.users[m.sender]
   let timeNow = Date.now()
   let cooldown = 86400000 // 24 hours in milliseconds

   conn.lastWorkTime = conn.lastWorkTime ? conn.lastWorkTime : {}
   if (/kerja|work/i.test(command)) {
      const jobFields = Object.keys(jobs).map((field, index) => `*${index + 1}.* ${field}`).join('\n');
      if (!type) return m.reply(`Pilih bidang pekerjaan yang sesuai\n${jobFields}\n\nContoh : kirim *${usedPrefix + command} petani* untuk bekerja pertanian`)

      let jobData = jobs[type]?.[Math.floor(Math.random() * jobs[type]?.length)]
      if (!jobData) return m.reply('Pekerjaan tidak ditemukan. Silakan pilih bidang pekerjaan yang sesuai dari daftar berikut :\n' + jobFields + `\nKetik: *${usedPrefix + command}petani*`)

      const penaltyChance = Math.random() < 0.5; // 50% chance of getting penalized
      if (timeNow - conn.lastWorkTime[m.sender] < cooldown) {
         let remainingTime = cooldown - (timeNow - conn.lastWorkTime[m.sender])
         return m.reply(`Kamu sudah bekerja, saatnya istirahat selama\n${Func.toTime(remainingTime)}`)
      }

      const earnedMoney = jobData.money * (jobData.difficulty === 'Extreme' ? 3 : jobData.difficulty === 'Hard' ? 2 : 1) * 10
      const earnedExp = jobData.exp * 10
      user.money = (user.money || 0) + earnedMoney
      user.exp = (user.exp || 0) + earnedExp
      conn.lastWorkTime[m.sender] = timeNow
      const taskInfo = Func.random(taskInformation[jobData.task])
      const randomMessage = Func.random([`👷 Kamu ${jobData.name} dan sedang ${jobData.task}\nTingkat Kesulitan: ${jobData.difficulty}\n\n💰 Mendapatkan uang senilai *${Func.h2k(earnedMoney)}*\n🔼 Dapatkan *${Func.h2k(earnedExp)}* EXP\nℹ️ Info Tambahan: ${taskInfo}`, `🔧 Sebagai ${jobData.name}, tugasmu adalah ${jobData.task}\nTingkat Kesulitan: ${jobData.difficulty}\n\n💰 Mendapatkan uang senilai *${Func.h2k(earnedMoney)}*\n🔼 Dapatkan *${Func.h2k(earnedExp)}* EXP\nℹ️ Info Tambahan: ${taskInfo}`, `🚜 Sebagai seorang ${jobData.name}, tugasmu adalah ${jobData.task}\nTingkat Kesulitan: ${jobData.difficulty}\n\n💰 Mendapatkan uang senilai *${Func.h2k(earnedMoney)}*\n🔼 Dapatkan *${Func.h2k(earnedExp)}* EXP\nℹ️ Info Tambahan: ${taskInfo}`])
      m.reply(randomMessage)
      if (penaltyChance && jobData.penalty) {
         user[type] -= 1
         m.reply(jobData.penalty)
      }
      setTimeout(() => {
         //m.reply("Waktumu untuk bekerja sudah tiba! Kamu bisa bekerja lagi sekarang.")
      }, cooldown)
   }
}
// Export handler
handler.help = ['kerja']
handler.tags = ['rpg']
handler.command = ['kerja', 'work']
handler.group = handler.rpg = handler.limit = handler.register = true
module.exports = handler