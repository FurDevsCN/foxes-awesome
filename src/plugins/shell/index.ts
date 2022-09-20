/**
 * 执行命令。只有Bot的管理者可以使用。
 */
import { Plugin } from 'foxes-plugin'
import * as foxes from 'mirai-foxes'
import text2image from '../../utils/text2image'
import { exec } from 'child_process'
export default {
  name: 'shell', // 插件的名字。
  init(
    plug: Plugin,
    config: {
      general?: {
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
          matcher: [foxes.Middleware.cmdMatch('.shell')] // 限制命令为shell。
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
          await new Promise<void>(resolve => {
            // 执行命令。
            exec(
              data.messageChain
                .slice(2)
                .map(data => (data as foxes.Message.Plain).text)
                .join(' '),
              async (error, stdout, stderr) => {
                // 这里是exec的回调函数。
                if (error) {
                  // 有错误的情况下，向部署者报告错误。
                  console.error(
                    `[ERROR] shell error ${error}, user ${data.sender.id}(group ${data.sender.group.id}), messageChain ${data.messageChain}`
                  )
                  return resolve() // 结束运行。
                }
                // 向管理员报告运行结果（使用Text2Image）。
                await plug.bot.send('group', {
                  qq: data.sender.group.id,
                  message: [
                    new foxes.Message.Image(
                      await plug.bot.upload(['image', 'group'], {
                        data: text2image(
                          `以下是服务器回传：\n\nstdout:\n${stdout}\n\nstderr:\n${stderr}`,
                          'error-font'
                        ),
                        suffix: 'png'
                      })
                    )
                  ]
                })
                // 结束运行。
                resolve()
              }
            )
          })
        })
      )
      // 提示部署者此插件已经被加载。非强制。
      console.info('[INFO] 已加载 shell。')
    } else {
      // 配置不存在，插件拒绝加载。
      console.error('[ERROR] shell 未正常加载。请检查您的配置文件。')
    }
    return plug
  }
}
