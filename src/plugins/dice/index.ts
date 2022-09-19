import { Plugin } from 'foxes-plugin'
import * as foxes from 'mirai-foxes'
export default {
  name: 'dice',
  init(plug: Plugin): Plugin {
    plug.on(
      'GroupMessage',
      foxes.Middleware.Middleware<'GroupMessage'>({
        matcher: [foxes.Middleware.cmdMatch('.dice')],
        parser: [foxes.Middleware.parseCmd]
      })(async data => {
        if (data.messageChain.length != 2) {
          return void (await plug.bot.send('group', {
            qq: data.sender.group.id,
            reply: data,
            message: [new foxes.Message.Plain('dice 语法错误。')]
          }))
        }
        return void (await plug.bot.send('group', {
          qq: data.sender.group.id,
          reply: data,
          message: [
            new foxes.Message.Plain(
              `取得了 ${Math.floor(Math.random() * 6) + 1}`
            )
          ]
        }))
      })
    )
    console.info('[INFO] 已加载 dice。')
    return plug
  }
}
