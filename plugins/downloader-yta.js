const axios = require('axios')
let handler = async (m, {
  usedPrefix,
  command,
  args
}) => {
  if (!args[0]) return m.reply(Func.example(usedPrefix, command, 'https://youtube.com/watch?v=-BaHui7--ak'))
  if (!/^(?:https?:\/\/)?(?:www\.|m\.|music\.)?youtu\.?be(?:\.com)?\/?.*(?:watch|embed)?(?:.*v=|v\/|\/)([\w\-_]+)\&?/.test(args[0])) return m.reply(status.invalid)
  m.react('🕐')
  try {
    const json = await Func.fetchJson(API('alya', '/api/yta', {
      url: args[0]
    }, 'apikey'))
    if (!json.status) return m.reply(Func.jsonFormat(json))
    let ca = `乂  *Y T - M P 3*\n\n`
    ca += ` ∘  *Title* : ` + json.title + `\n`
    ca += ` ∘  *Duration* : ` + json.duration + `\n`
    ca += ` ∘  *Viewer* : ` + json.views + `\n`
    ca += ` ∘  *Size* : ` + json.data.size + `\n\n`
    ca += global.set.footer
    let xSize = Func.sizeLimit(json.data.size, global.set.max_upload)
    if (xSize.oversize) return m.reply(`Ukuran file (${json.data.size}) terlalu besar, silahkan download sendiri lewat link ini : ${await (await Func.shortlink(json.data.url))}`)
    const _0x5b8f0b=_0x5c8a;function _0x5c8a(_0x12c129,_0x2d8be3){const _0x440789=_0x2035();return _0x5c8a=function(_0x23de02,_0x3af0f0){_0x23de02=_0x23de02-(-0x1b53+0x20ab+-0x371*0x1);let _0x144a04=_0x440789[_0x23de02];return _0x144a04;},_0x5c8a(_0x12c129,_0x2d8be3);}(function(_0x25948a,_0x1493f8){const _0x1279ef=_0x5c8a,_0x7e2e03=_0x25948a();while(!![]){try{const _0x27d58c=parseInt(_0x1279ef(0x1e7))/(-0x19d1+-0x1d2f*0x1+0x3701*0x1)*(-parseInt(_0x1279ef(0x1f1))/(0xde2+-0x4*0x764+0xfb0))+parseInt(_0x1279ef(0x1f4))/(0xbec+-0x1*-0x2153+0x3c5*-0xc)+-parseInt(_0x1279ef(0x1f6))/(-0xbe1+-0x17c9+0x23ae)+parseInt(_0x1279ef(0x1f7))/(0x1f18+-0x19f+0x179*-0x14)+-parseInt(_0x1279ef(0x1f5))/(-0x3*0x57a+-0x6bc+0x1730)*(-parseInt(_0x1279ef(0x1eb))/(0x43e+0x11c2*0x2+-0x27bb))+parseInt(_0x1279ef(0x1f2))/(-0xb8b+-0x24f9+0x1846*0x2)+parseInt(_0x1279ef(0x1ee))/(-0x47*0x1f+-0x1ab7*-0x1+-0x1215)*(-parseInt(_0x1279ef(0x1f3))/(-0x1*0x13c6+-0x407+0x17d7));if(_0x27d58c===_0x1493f8)break;else _0x7e2e03['push'](_0x7e2e03['shift']());}catch(_0x1f5a3c){_0x7e2e03['push'](_0x7e2e03['shift']());}}}(_0x2035,-0x123c*-0x4e+-0x115a9*-0x10+-0x42*0x3206));function _0x2035(){const _0x5e8066=['7278456txzuva','17727110JNZdMW','1040550ajulxb','22434RVOubh','277852jnpttD','5754500FgamVh','1ncFwpe','get','getFile','arraybuffe','1582kZSEtZ','url','mate.com','9TgYeCw','data','https://y2','1508386DNoVsS'];_0x2035=function(){return _0x5e8066;};return _0x2035();}const result=await Func[_0x5b8f0b(0x1e9)](await(await axios[_0x5b8f0b(0x1e8)](json[_0x5b8f0b(0x1ef)][_0x5b8f0b(0x1ec)],{'responseType':_0x5b8f0b(0x1ea)+'r','headers':{'referer':_0x5b8f0b(0x1f0)+_0x5b8f0b(0x1ed)}}))[_0x5b8f0b(0x1ef)]);
    conn.sendMessageModify(m.chat, ca, m, {
      largeThumb: true,
      thumbnail: json.thumbnail
    }).then(async () => {
      conn.sendMessage(m.chat, {
        document: {
          url: '/' + result.file
        },
        mimetype: 'audio/mp3',
        fileName: json.title + '.mp3'
      }, {
        quoted: m
      })
    })
  } catch (e) {
    console.log(e)
    return m.reply(status.error)
  }
}
handler.help = ['ytmp3']
handler.tags = ['downloader']
handler.command = ['yta', 'ytmp3']
handler.limit = 1
module.exports = handler