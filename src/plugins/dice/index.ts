/**
 * 骰子插件。使用命令.dice即可投出1-6点。
 */
import { Plugin } from 'foxes-plugin'
import * as foxes from 'mirai-foxes'
export default {
  name: 'dice', // 插件名称。
  init(plug: Plugin): Plugin {
    plug.on(
      'GroupMessage', // 本插件适用于群聊，故使用群聊消息。
      foxes.Middleware.Middleware<'GroupMessage'>({
        matcher: [
          foxes.Middleware.cmdMatch('.dice'), // 限制命令为dice。
          foxes.Middleware.templateMatch(['Plain']) // 限制只能有dice这一个内容。
        ],
        parser: [foxes.Middleware.parseCmd] // 启用默认解析器。
      })(async data => {
        return void (await plug.bot.send('group', {
          qq: data.sender.group.id, // 发送到用户所在的群聊。
          reply: data, // 回复用户的消息。
          message: [
            new foxes.Message.Plain(
              `取得了 ${Math.floor(Math.random() * 6) + 1}` // 告诉用户取得了几点。
            ) // 构造一个文本消息。
          ] // 消息数组。
        })) // 发送消息。
      }) // 生成中间件。中间件的生成方式形如foxes.Middleware.Middleware<EventType>(...)(done function)。
    )
    console.info('[INFO] 已加载 dice。') // 提示部署者此插件已经被加载。非强制。
    return plug
  }
}
