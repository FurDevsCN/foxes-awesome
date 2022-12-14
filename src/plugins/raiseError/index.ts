/**
 * 抛出错误。只有Bot的管理者可以使用。
 */
import { Plugin } from 'foxes-plugin'
import * as foxes from 'mirai-foxes'
import text2image from '../../utils/text2image'
export default {
  name: 'raiseError', // 插件的名字。
  init(
    plug: Plugin,
    config: {
      general?: {
        // 通用选项。
        admin?: foxes.Base.UserID[] // 用于描述管理者的数组。
      }
    } // 配置项。由于不确定是否有此项，故需要用可选参数表示。
  ): Plugin {
    // 判断配置项是否存在。
    if (config.general?.admin) {
      plug.on(
        'GroupMessage',
        foxes.Middleware.Middleware<'GroupMessage'>({
          parser: [foxes.Middleware.parseCmd], // 启用默认解析器。
          matcher: [
            foxes.Middleware.cmdMatch('.raiseError') // 限制命令为raiseError。
          ]
        })(async data => {
          // 强制参数大于2个（不包含命令）。因为Middleware过滤不支持可变参数，故需要手动过滤。
          if (
            data.messageChain.length < 3 ||
            !data.messageChain.slice(2).every(data => data.type == 'Plain')
          ) {
            // 拒绝处理命令。
            return
          }
          // 判断用户是否在管理员中。
          if (!config.general?.admin?.includes(data.sender.id)) {
            // 如果不在，拒绝用户使用。
            return void (await plug.bot.send('group', {
              qq: data.sender.group.id,
              reply: data,
              message: [new foxes.Message.Plain('权限不足。')]
            }))
          }
          try {
            // 抛出错误。
            throw new Error(
              data.messageChain
                .slice(2)
                .map(data => (data as foxes.Message.Plain).text)
                .join(' ')
            )
          } catch (c) {
            // 发送错误消息（使用Text2Image）。
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
      // 提示部署者此插件已经被加载。非强制。
      console.info('[INFO] 已加载 raiseError。')
    } else {
      // 配置不存在，插件拒绝加载。
      console.error('[ERROR] raiseError 未正常加载。请检查您的配置文件。')
    }
    return plug
  }
}
