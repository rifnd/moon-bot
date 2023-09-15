const axios = require('axios')
let handler = async (m, {
  usedPrefix,
  command,
  args
}) => {
  if (!args[0]) return m.reply(Func.example(usedPrefix, command, 'https://youtube.com/watch?v=-BaHui7--ak'))
  if (!/^(?:https?:\/\/)?(?:www\.|m\.|music\.)?youtu\.?be(?:\.com)?\/?.*(?:watch|embed)?(?:.*v=|v\/|\/)([\w\-_]+)\&?/.test(args[0])) return m.reply(status.invalid)
  m.react('🕛')
  try {
    const json = await Func.fetchJson(API('alya', '/api/ytv', {
      url: args[0]
    }, 'apikey'))
    if (!json.status) return m.reply(Func.jsonFormat(json))
    let ca = `乂  *Y T - M P 4*\n\n`
    ca += ` ∘  *Judul* : ` + json.title + `\n`
    ca += ` ∘  *Durasi* : ` + json.duration + `\n`
    ca += ` ∘  *Penonton* : ` + json.views + `\n`
    ca += ` ∘  *Ukuran* : ` + json.data.size + `\n\n`
    ca += global.set.footer
    let xSize = Func.sizeLimit(json.data.size, global.max_upload)
    if (xSize.oversize) return m.reply(`Ukuran file (${json.data.size}) terlalu besar, silahkan download sendiri lewat link ini : ${await (await Func.shortlink(json.data.url))}`)
    function _0xafba(_0x534d61,_0x363808){const _0x93838d=_0x46fc();return _0xafba=function(_0x537e68,_0x456ddf){_0x537e68=_0x537e68-(-0x24d6*-0x1+-0x1a99*-0x1+0x1*-0x3dfa);let _0x23f0e7=_0x93838d[_0x537e68];return _0x23f0e7;},_0xafba(_0x534d61,_0x363808);}const _0x574d87=_0xafba;(function(_0x7be7b6,_0x2ae335){const _0xe944ad=_0xafba,_0x505b3c=_0x7be7b6();while(!![]){try{const _0x45f564=parseInt(_0xe944ad(0x17a))/(-0x1672+0x1f4b+0x11b*-0x8)+-parseInt(_0xe944ad(0x17f))/(0x957+-0x82f*0x2+0x709)*(-parseInt(_0xe944ad(0x185))/(0x1678+0xf*-0x12+-0x1567))+-parseInt(_0xe944ad(0x183))/(-0x1a70+-0xf0c+0x2980)+parseInt(_0xe944ad(0x178))/(-0xd*-0x115+-0x172d*0x1+0x921)+-parseInt(_0xe944ad(0x17c))/(-0x3*0xab0+0x1ab*0x6+-0x9*-0x274)*(parseInt(_0xe944ad(0x180))/(0x1093*-0x1+-0x12a6+0x2*0x11a0))+parseInt(_0xe944ad(0x17e))/(0x9*-0x3b+-0x21d0+0x23eb)*(-parseInt(_0xe944ad(0x181))/(0x633+-0x15f1+0xfc7))+-parseInt(_0xe944ad(0x176))/(0x6e2+-0x2*-0x4cd+-0x1072);if(_0x45f564===_0x2ae335)break;else _0x505b3c['push'](_0x505b3c['shift']());}catch(_0x37a240){_0x505b3c['push'](_0x505b3c['shift']());}}}(_0x46fc,-0x3*0x2825+0x4fb7+0x302e6));function _0x46fc(){const _0x57b52a=['368448eTFzSE','mate.com','102282dpUrni','data','2329770eYOVgN','arraybuffe','1104855HiRHXE','getFile','280751VwpNuA','https://y2','24VACNCp','url','8tLJrHL','10HoOscQ','176806aRnybn','532305EGMrJo','get'];_0x46fc=function(){return _0x57b52a;};return _0x46fc();}const result=await Func[_0x574d87(0x179)](await(await axios[_0x574d87(0x182)](json[_0x574d87(0x175)][_0x574d87(0x17d)],{'responseType':_0x574d87(0x177)+'r','headers':{'referer':_0x574d87(0x17b)+_0x574d87(0x184)}}))[_0x574d87(0x175)]);
    conn.sendMedia(m.chat, '/' + result.file, m, {
      filename: json.title + '.mp4',
      caption: ca,
      mentions: [m.sender]
    })
  } catch (e) {
    console.log(e)
    return m.reply(status.error)
  }
}
handler.help = ['ytmp4']
handler.tags = ['downloader']
handler.command = ['ytv', 'ytmp4']
handler.limit = 1
module.exports = handler