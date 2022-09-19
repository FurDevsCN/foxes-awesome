import * as foxes from 'mirai-foxes'
import { registerFont } from 'canvas'
import { Plugin, PluginManager } from 'foxes-plugin'
import { getPlugins } from './module'
import { init } from './console'
async function runbot(): Promise<void> {
  let bot: foxes.Bot = new foxes.Bot()
  await bot.open({
    wsUrl: 'ws://127.0.0.1:8080',
    httpUrl: 'http://127.0.0.1:8080',
    verifyKey: 'awathefox',
    qq: 3577721071
  })
  registerFont('./src/res/font.ttf', { family: 'error-font' })
  let pm = new PluginManager(bot)
  ;(await getPlugins()).forEach(value => {
    pm.install(value.name, value.init(new Plugin(pm)))
  })
  console.log('/// 凌、行きます！ ///')
  // bot.on('GroupMessage', async data => {
  //   console.log(data)
  // })
  init(pm)
}
runbot()
