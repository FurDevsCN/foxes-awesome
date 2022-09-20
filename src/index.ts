/**
 * 欢迎使用 mirai-foxes！这是一个小型而有趣的示例，演示了不少 foxes-plugin 和 mirai-foxes 的特性使用。
 * 程序的每个部分都有不少注释，用于解释语句的作用。
 * 若您发现部分内容解释不清楚，请开 issue。
 * 希望您可以在其中学到不少。
 * @see https://github.com/FurDevsCN/mirai-foxes
 * @see https://github.com/FurDevsCN/foxes-plugin
 * @see https://github.com/FurDevsCN/foxes-awesome
 */
import * as foxes from 'mirai-foxes' // 导入 mirai-foxes 中的所有内容（用于建立主要机器人连接）。
import { registerFont } from 'canvas' // 注册default font，用于 text2image（文本转图像）。
import { Plugin, PluginManager } from 'foxes-plugin' // 导入 foxes-plugin 中的必要内容（用于实现多模块，相当于 graia-ariadne 中的简易版 Channel）。
import { getPlugins } from './module' // 导入获得所有插件的函数。请看 module 来获得更多信息（相当于 graia-ariadne 中的简易版 Saya）。
import { init } from './console' // 命令系统初始化。
import { readFileSync } from 'fs' // 用于读取配置。
/**
 * 启动Bot。
 */
async function runbot(): Promise<void> {
  const bot: foxes.Bot = new foxes.Bot() // 新建 Bot 对象。
  await bot.open({
    wsUrl: 'ws://127.0.0.1:8080', // Websocket 链接，需要带 ws 协议头，可与 httpUrl 不是一个端口/地址。
    httpUrl: 'http://127.0.0.1:8080', // http 链接，需要带 http 协议头，可与 wsUrl 不是一个端口/地址。
    verifyKey: 'awathefox', // 验证密钥。
    qq: 3577721071 // 机器人的QQ。
  }) // 打开 mirai-api-http 远程链接。
  const config = JSON.parse(readFileSync('src/config.json').toString()) // 读取配置。
  registerFont('./src/res/font.ttf', { family: 'error-font' }) // 注册默认字体。
  /**
   * 创建插件管理器。
   * 注意：pm 和 bot.on 不能同时使用，插件中也不能使用 plug.bot.on，那是无效的。
   * 注意：plug.bot.wait 不受影响。
   * 注意：不建议调用 plug.dispatch。
   */
  const pm = new PluginManager(bot)
  ;(await getPlugins()).forEach(value => {
    pm.install(
      value.name, // 插件的名字。这里是我们自定义模块导出的名字。
      value.init(new Plugin(pm), config) // 初始化插件。
    )
  }) // 获得插件后，批次安装插件。
  init(pm, config) // 初始化命令系统。
  console.log('/// 凌、行きます！ ///') // 在完成后，输出一条代表初始化完成的消息。
}
runbot() // 启动主函数。Javascript 中全局语句默认是同步的，需要异步包装。
