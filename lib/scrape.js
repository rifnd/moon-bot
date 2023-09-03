const cheerio = require('cheerio')
const fetch = require('node-fetch')
const axios = require('axios')
const qs = require('qs')
const fs = require('fs')
const chalk = require('chalk')
const { fromBuffer } = require('file-type')
const FormData = require('form-data')


exports.joox = (query) => {
  return new Promise((resolve, reject) => {
    const time = Math.floor(new Date() / 1000)
    axios.get('http://api.joox.com/web-fcgi-bin//web_search?lang=id&country=id&type=0&search_input=' + query + '&pn=1&sin=0&ein=29&_=' + time)
    .then(({
      data
    }) => {
      let result = []
      let hasil = []
      let promoses = []
      let ids = []
      data.itemlist.forEach(result => {
        ids.push(result.songid)
      });
      for (let i = 0; i < data.itemlist.length; i++) {
        const get = 'http://api.joox.com/web-fcgi-bin/web_get_songinfo?songid=' + ids[i]
        promoses.push(
          axios.get(get, {
            headers: {
              Cookie: 'wmid=142420656; user_type=1; country=id; session_key=2a5d97d05dc8fe238150184eaf3519ad;'
            }
          })
          .then(({
            data
          }) => {
            const res = JSON.parse(data.replace('MusicInfoCallback(', '').replace('\n)', ''))
            hasil.push({
              lagu: res.msong,
              album: res.malbum,
              penyanyi: res.msinger,
              publish: res.public_time,
              img: res.imgSrc,
              mp3: res.mp3Url
            })
            Promise.all(promoses).then(() => resolve({
              creator: "Aine",
              status: true,
              data: hasil,
            }))
          }).catch(reject)
        )
      }
    }).catch(reject)
  })
}

exports.otakudesu = (query) => {
  return new Promise((resolve,
    reject) => {
    axios.get(`https://otakudesu.watch/?s=${query}&post_type=anime`).then(({
      data
    }) => {
      const hasil = []
      const $ = cheerio.load(data)
      $('#venkonten > div > div.venser > div > div > ul > li').each(function (a, b) {
        result = {
          status: 200,
          author: author,
          judul: $(b).find('> h2 > a').text(),
          thumbnail: $(b).find('> img').attr('src'),
          link: $(b).find('> h2 > a').attr('href')
        };
        hasil.push(result);
      });
      resolve(hasil)
    }).catch(reject)
  })
}

exports.otakudesuinfo = (url) => {
  return new Promise((resolve,
    reject) => {
    axios.get(url).then(({
      data
    }) => {
      const $ = cheerio.load(data)
      result = {
        status: 200,
        author: author,
        judul: $('#venkonten > div.venser > div.fotoanime > div.infozin > div > p:nth-child(1) > span').text().split(': ')[1],
        japanese: $('#venkonten > div.venser > div.fotoanime > div.infozin > div > p:nth-child(2) > span').text().split(': ')[1],
        rating: $('#venkonten > div.venser > div.fotoanime > div.infozin > div > p:nth-child(3) > span').text().split(': ')[1],
        produser: $('#venkonten > div.venser > div.fotoanime > div.infozin > div > p:nth-child(4) > span').text().split(': ')[1],
        tipe: $('#venkonten > div.venser > div.fotoanime > div.infozin > div > p:nth-child(5) > span').text().split(': ')[1],
        anime_status: $('#venkonten > div.venser > div.fotoanime > div.infozin > div > p:nth-child(6) > span').text().split(': ')[1],
        total_episode: $('#venkonten > div.venser > div.fotoanime > div.infozin > div > p:nth-child(7) > span').text().split(': ')[1],
        durasi: $('#venkonten > div.venser > div.fotoanime > div.infozin > div > p:nth-child(8) > span').text().split(': ')[1],
        rilis: $('#venkonten > div.venser > div.fotoanime > div.infozin > div > p:nth-child(9) > span').text().split(': ')[1],
        studio: $('#venkonten > div.venser > div.fotoanime > div.infozin > div > p:nth-child(10) > span').text().split(': ')[1],
        genre: $('#venkonten > div.venser > div.fotoanime > div.infozin > div > p:nth-child(11)').text().split(': ')[1],
        download_lengkap: $('#venkonten > div.venser > div:nth-child(10) > ul > li > span:nth-child(1) > a').attr('href'),
        thumbnail: $('#venkonten > div.venser > div.fotoanime > img').attr('src'),
        sinopsis: $('#venkonten > div.venser > div.fotoanime > div.sinopc').text().trim()
      };
      resolve(result)
    }).catch(reject)
  })
}

exports.otakudesuongoing = () => {
  return new Promise((resolve,
    reject) => {
    axios.get(`https://otakudesu.watch`).then(({
      data
    }) => {
      const hasil = []
      const $ = cheerio.load(data)
      $('#venkonten > div > div.venser > div.venutama > div > div.rapi > div > ul > li').each(function (a, b) {
        result = {
          status: 200,
          author: author,
          judul: $(b).find('> div > div.thumb > a > div > h2').text().trim(),
          episode: $(b).find('> div > div.epz').text().trim(),
          tanggal: $(b).find('> div > div.newnime').text().trim(),
          hari: $(b).find('> div > div.epztipe').text().trim(),
          thumbnail: $(b).find('> div > div.thumb > a > div > img').attr('src'),
          link: $(b).find('> div > div.thumb > a').attr('href')
        };
        hasil.push(result);
      });
      resolve(hasil)
    }).catch(reject)
  })
}

exports.kiryu = (query) => {
  return new Promise((resolve,
    reject) => {
    axios.get(`https://kiryuu.id/?s=${query}`)
    .then(({
      data
    }) => {
      const hasil = []
      const $ = cheerio.load(data)
      $('#content > div.wrapper > div.postbody > div > div.listupd > div ').each(function (a, b) {
        result = {
          status: 200,
          author: author,
          judul: $(b).find('> div > a').attr('title'),
          manga_status: $(b).find('> div > a > div.limit > span.status.Completed').text() ? $(b).find('> div > a > div.limit > span.status.Completed').text(): 'Not Complete',
          last_chapter: $(b).find('> div > a > div.bigor > div.adds > div.epxs').text(),
          ranting: $(b).find('> div > a > div.bigor > div.adds > div.rt > div > div.numscore').text(),
          thumbnail: $(b).find('> div > a > div.limit > img').attr('src'),
          link: $(b).find('> div > a').attr('href')
        };
        hasil.push(result);
      });
      resolve(hasil)
    })
    .catch(reject)
  })
}

exports.manga = (query) => {
  return new Promise((resolve,
    reject) => {
    axios.get(`https://www.anime-planet.com/manga/all?name=${query}`)
    .then(({
      data
    }) => {
      const hasil = []
      const $ = cheerio.load(data)
      $('#siteContainer > ul.cardDeck.cardGrid > li ').each(function (a, b) {
        result = {
          status: 200,
          author: author,
          judul: $(b).find('> a > h3').text(),
          link: 'https://www.anime-planet.com' + $(b).find('> a').attr('href'),
          thumbnail: $(b).find('> a > div.crop > img').attr('src').startsWith('https://') ? $(b).find('> a > div.crop > img').attr('src'): 'https://www.anime.planet.com' + $(b).find('> a > div.crop > img').attr('src')
        };
        hasil.push(result);
      });
      resolve(hasil)
    })
    .catch(reject)
  })
}

exports.cerpen = (category) => {
  return new Promise(async (resolve,
    reject) => {
    let title = category.toLowerCase().replace(/[()*]/g,
      "")
    let judul = title.replace(/\s/g,
      "-")
    let page = Math.floor(Math.random() * 5)
    axios.get('http://cerpenmu.com/category/cerpen-'+judul+'/page/'+page)
    .then((get) => {
      let $ = cheerio.load(get.data)
      let link = []
      $('article.post').each(function (a, b) {
        link.push($(b).find('a').attr('href'))
      })
      let random = link[Math.floor(Math.random() * link.length)]
      axios.get(random)
      .then((res) => {
        let $$ = cheerio.load(res.data)
        let hasil = {
          title: $$('#content > article > h1').text(),
          author: $$('#content > article').text().split('Cerpen Karangan: ')[1].split('Kategori: ')[0],
          kategori: $$('#content > article').text().split('Kategori: ')[1].split('\n')[0],
          lolos: $$('#content > article').text().split('Lolos moderasi pada: ')[1].split('\n')[0],
          cerita: $$('#content > article > p').text()
        }
        resolve(hasil)
      })
    })
  })
}

exports.anime = (query) => {
  return new Promise((resolve,
    reject) => {
    axios.get(`https://www.anime-planet.com/anime/all?name=${query}`)
    .then(({
      data
    }) => {
      const hasil = []
      const $ = cheerio.load(data)
      $('#siteContainer > ul.cardDeck.cardGrid > li ').each(function (a, b) {
        result = {
          status: 200,
          author: author,
          judul: $(b).find('> a > h3').text(),
          link: 'https://www.anime-planet.com' + $(b).find('> a').attr('href'),
          thumbnail: $(b).find('> a > div.crop > img').attr('src').startsWith('https://') ? $(b).find('> a > div.crop > img').attr('src'): 'https://www.anime.planet.com' + $(b).find('> a > div.crop > img').attr('src')
        };
        hasil.push(result);
      });
      resolve(hasil)
    }).catch(reject)
  })
}

exports.character = (query) => {
  return new Promise((resolve,
    reject) => {
    axios.get(`https://www.anime-planet.com/characters/all?name=${query}`)
    .then(({
      data
    }) => {
      const hasil = []
      const $ = cheerio.load(data)
      $('#siteContainer > table > tbody > tr').each(function (a, b) {
        result = {
          status: 200,
          author: author,
          character: $(b).find('> td.tableCharInfo > a').text(),
          link: 'https://www.anime-planet.com' + $(b).find('> td.tableCharInfo > a').attr('href'),
          thumbnail: $(b).find('> td.tableAvatar > a > img').attr('src').startsWith('https://') ? $(b).find('> td.tableAvatar > a > img').attr('src'): 'https://www.anime.planet.com' + $(b).find('> td.tableAvatar > a > img').attr('src')
        };
        hasil.push(result);
      });
      resolve(hasil)
    })
    .catch(reject)
  })
}

exports.apk = async (query) => {
  return new Promise(async (resolve) => {
    axios.get('https://rexdl.com/?s=' + query).then(({
      data
    }) => {
      const $ = cheerio.load(data)
      const judul = []
      const jenis = []
      const date = []
      const desc = []
      const link = []
      const thumb = []
      const result = []
      $('div > div.post-content').each(function(a, b) {
        judul.push($(b).find('h.post-title > a').attr('title'))
        jenis.push($(b).find('p.post-category').text())
        date.push($(b).find('p.post-date').text())
        desc.push($(b).find('div.entry.excerpt').text())
        link.push($(b).find('h2.post-title > a').attr('href'))
      })
      $('div > div.post-thumbnail > a > img').each(function(a, b) {
        thumb.push($(b).attr('data-src'))
      })
      for (let i = 0; i < judul.length; i++) {
        result.push({
          judul: judul[i],
          kategori: jenis[i],
          upload_date: date[i],
          deskripsi: desc[i],
          thumb: thumb[i],
          link: link[i],
        })
      }
      resolve(result != '' ? {
        creator: 'nando',
        status: false,
        result: result
      }: {
        creator: 'nando',
        status: false
      })
    })
  })
}

exports.uploader = (buffer) => {
  return new Promise(async (resolve) => {
    try {
      const { ext } = await fromBuffer(buffer)
      const form = new FormData()
      form.append('file',
        buffer,
        'tmp.' + ext)
      const json = await (await axios.post("https://tmpfiles.org/api/v1/upload", form, {
        headers: {
          "accept": "*/*",
          "accept-language": "id-ID , id; q=O. 9 , en- US ; q=0.8, en q=0.7",
          "content-type": "multipart/form-data",
          "origin": "https://tmpfiles.orgi",
          "referer": "https://tmpfiles.org/",
          "sec-ch-ua": '"Chromium";v="107", "Not=A?Brand";v="24"',
          "sec-ch-ua-mobile": "?1",
          "sec-ch-ua-platform": "Android",
          "sec-fetch-dest": "empty",
          "sec-fetch-mcde": "cors",
          "sec-fetch-site": "same-origin",
          "user-agent": "Mozilla/5.0 (Linux; Android 6.0.1; SM-J500G) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.131 Mobile Safari/537.36",
          "x-requested-with": "XMLHttpRequest",
          ...form.getHeaders()
        }})).data
      if (json.status != 'success') return resolve({
        developer: '@Alya Uhuy',
        status: false,
        msg: 'Failed to uploaded'
      })
      resolve({
        developer: '@Alya Uhuy',
        status: true,
        data: {
          url: json.data.url.replace(
            'https://tmpfiles.org/',
            'https://tmpfiles.org/dl/'
          )
        }
      })
    } catch (e) {
      console.log(e)
      resolve({
        developer: '@Alya Uhuy',
        status: false,
        msg: e.message
      })
    }
  })
}

let file = require.resolve(__filename)
fs.watchFile(file, () => {
  fs.unwatchFile(file)
  console.log(chalk.redBright(`Update ${__filename}`))
  delete require.cache[file]
  require(file)
})