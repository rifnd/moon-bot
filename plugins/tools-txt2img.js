let handler = async (m, {
  conn,
  usedPrefix,
  command,
  text
}) => {
  try {
    if (!text) return m.reply(Func.example(usedPrefix, command, 'photo of attractive woman dark hair, gray eyes, open Shirt, lachs, on the street. | model'))
    let [input, model] = text.split` | `
    if (!input || !model) return m.reply('Models is wrong.')
    m.react('🕒')
    const json = await Func.fetchJson(API('alya', '/api/text2img', {
      text: input,
      models: model || 'default'
    }, 'apikey'))
    if (!json.status) return m.reply(Func.jsonFormat(json))
    let ca = `*Prompt* : ${json.data.prompt}\n`
    ca += `*Negative Prompt* : ${json.data.negative_prompt}\n`
    ca += `*Models* : ${json.data.models[0]}\n`
    ca += `*Created At* : ${new Date(json.data.start_times)}\n`
    ca += `*Nsfw* : ${json.data.nsfw}\n`
    ca += `*Trusted Workers* : ${json.data.trusted_workers}\n`
    ca += `*Slow Workers* : ${json.data.slow_workers}\n`
    ca += `*Censor Nsfw* : ${json.data.censor_nsfw}\n`
    ca += `*Pending* : ${json.data.is_pending}\n`
    ca += `*Source Processing* : ${json.data.source_processing}\n`
    ca += `*Hr Resize Y* : ${json.data.hr_resize_y}\n`
    ca += `*Hr Resize X* : ${json.data.hr_resize_x}\n`
    ca += `*Source Processing* : ${json.data.source_processing}\n`
    ca += `*Replacement Filter* : ${json.data.replacement_filter}\n`
    ca += `*Server* : ${json.data.servers}\n`
    ca += `*Sampler Name* : ${json.data.params.sampler_name}\n`
    ca += `*Do Not Save Samples* : ${json.data.params.do_not_save_samples}\n`
    ca += `*Sampler Index* : ${json.data.params.sampler_index}\n`
    ca += `*Seed* : ${json.data.params.seed}\n`
    ca += `*Cfg Scale* : ${json.data.params.cfg_scale}\n`
    ca += `*Denoising Strength* : ${json.data.params.subseed_strength}\n`
    ca += `*Subseed Strength* : ${json.data.params.subseed_strength}\n`
    ca += `*Subseed* : ${json.data.params.subseed}\n`
    ca += `*Batch Size* : ${json.data.params.batch_size}\n`
    ca += `*Width* : ${json.data.params.width}\n`
    ca += `*Height* : ${json.data.params.height}\n`
    ca += `*Hr Uscale* : ${json.data.params.hr_upscaler}\n`
    ca += `*Hr Scale* : ${json.data.params.hr_scale}\n`
    ca += `*Seed Variation* : ${json.data.params.seed_variation}\n`
    ca += `*Clip Skip* : ${json.data.params.clip_skip}\n`
    ca += `*Control Type* : ${json.data.params.control_type}\n`
    ca += `*Steps* : ${json.data.params.steps}\n`
    ca += `*Loras* : ${json.data.params.loras}\n`
    ca += `*Facefixer Strength* : ${json.data.params.facefixer_strength}\n`
    ca += `*Number of image* : ${json.data.params.number_of_image}`
    m.reply(ca).then(async () => {
      await Func.delay(1500)
      conn.sendFile(m.chat, json.data.images_url, '', '', null)
    })
  } catch (e) {
    console.log(e)
    return m.reply(Func.jsonFormat(e))
  }
}
handler.help = ['text2img']
handler.tags = ['internet']
handler.command = ['text2img', 'txt2img']
handler.premium = true
module.exports = handler