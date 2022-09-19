import { Plugin } from 'foxes-plugin'
import * as foxes from 'mirai-foxes'
import text2image from '../../utils/text2image'
export default {
  name: 'raiseError',
  init(plug: Plugin): Plugin {
    plug.on(
      'GroupMessage',
      foxes.Middleware.Middleware<'GroupMessage'>({
        parser: [foxes.Middleware.parseCmd],
        matcher: [foxes.Middleware.cmdMatch('.raiseError')]
      })(async data => {
        if (
          data.messageChain.length < 3 ||
          !data.messageChain.slice(2).every(data => data.type == 'Plain')
        ) {
          return void (await plug.bot.send('group', {
            qq: data.sender.group.id,
            reply: data,
            message: [new foxes.Message.Plain('raiseError 语法错误。')]
          }))
        }
        try {
          throw new Error(
            data.messageChain
              .slice(2)
              .map(data => (data as foxes.Message.Plain).text)
              .join(' ')
          )
        } catch (c) {
          await plug.bot.send('group', {
            qq: data.sender.group.id,
            message: [
              new foxes.Message.Image(
                await plug.bot.upload(['image', 'group'], {
                  data: text2image(
                    `发生异常。\n${
                      (c as Error).stack as string
                    }\n请联系开发者以获得支持。`,
                    'error-font'
                  ),
                  suffix: 'png'
                })
              )
            ]
          })
        }
      })
    )
    console.info('[INFO] 已加载 raiseError。')
    return plug
  }
}
