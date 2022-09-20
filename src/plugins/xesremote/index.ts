/**
 * 远程执行C++或Python。
 * 本插件基于学而思提供的远程虚拟主机。请勿滥用。
 * @see https://github.com/FurryR/XesRemote
 */
import { Plugin } from 'foxes-plugin'
import * as foxes from 'mirai-foxes'
import text2image from '../../utils/text2image'
import * as xesremote from './xesremote'
export default {
  name: 'xesremote', // 插件的名字。
  init(plug: Plugin): Plugin {
    // C++
    plug.on(
      'GroupMessage',
      foxes.Middleware.Middleware<'GroupMessage'>({
        matcher: [
          foxes.Middleware.templateMatch(['Plain']), // 限制只能有文本。由于不启用Parser，这里将不会分割messageChain，故可以正常匹配。
          foxes.Middleware.prefixMatch('.cpp') // 前缀匹配。
        ]
      })(async data => {
        /**
         * 此部分开始到下一个注释为止是参数的解析。使用格式如下：
         * .cpp|.python "字符串参数1 字符串参数2(允许转义)"
         * 实际代码...
         */
        let text = (data.messageChain[1] as foxes.Message.Plain).text
        const argsraw = text.substring(0, text.indexOf('\n'))
        let args = ''
        text = text.substring(text.indexOf('\n') + 1)
        if (argsraw.indexOf(' ') != -1) {
          try {
            args = JSON.parse(argsraw.substring(argsraw.indexOf(' ') + 1))
            if (typeof args != 'string') throw new Error()
          } catch (_) {
            return void plug.bot.send('group', {
              qq: data.sender.group.id,
              reply: data,
              message: [new foxes.Message.Plain('字符串解析错误。')]
            })
          }
        }
        // 打开远程主机链接。
        const a = new xesremote.XesRemote({
          lang: xesremote.Language.Cpp,
          content: text,
          echo: false
        })
        await plug.bot.send('group', {
          qq: data.sender.group.id,
          message: [
            new foxes.Message.Image(
              await plug.bot.upload(['image', 'group'], {
                data: text2image(
                  await new Promise<string>(resolve => {
                    // 构造结果字符串。
                    let s = '以下是执行结果：\n'
                    a.onmessage = ev => {
                      // 处理回传。
                      if (ev.type == xesremote.MsgType.Output) {
                        // 正常输出。
                        s += ev.data.toString('utf-8')
                      } else {
                        // 其它消息。
                        s += `[${ev.type} Message ${ev.data.toString()}]\n`
                      }
                    }
                    a.onopen = async () => {
                      // 获得主机的ID。
                      s += `[Connected to ${await a.host()}]\n`
                      // 发送参数。
                      await a.send(args)
                      // 限时。
                      setTimeout(async () => {
                        await a.close()
                        return resolve(s + '\n运行超时。')
                      }, 10000)
                    }
                    // 连接关闭时，回传结果。
                    a.onclose = () => resolve(s)
                  }),
                  'error-font'
                ),
                suffix: 'png'
              })
            )
          ]
        })
      })
    )
    // Python
    plug.on(
      'GroupMessage',
      foxes.Middleware.Middleware<'GroupMessage'>({
        matcher: [
          foxes.Middleware.templateMatch(['Plain']), // 限制只能有文本。由于不启用Parser，这里将不会分割messageChain，故可以正常匹配。
          foxes.Middleware.prefixMatch('.python') // 前缀匹配。
        ]
      })(async data => {
        /**
         * 此部分开始到下一个注释为止是参数的解析。使用格式如下：
         * .cpp|.python "字符串参数1 字符串参数2(允许转义)"
         * 实际代码...
         */
        let text = (data.messageChain[1] as foxes.Message.Plain).text
        const argsraw = text.substring(0, text.indexOf('\n'))
        let args = ''
        text = text.substring(text.indexOf('\n') + 1)
        if (argsraw.indexOf(' ') != -1) {
          try {
            args = JSON.parse(argsraw.substring(argsraw.indexOf(' ') + 1))
            if (typeof args != 'string') throw new Error()
          } catch (_) {
            return void plug.bot.send('group', {
              qq: data.sender.group.id,
              reply: data,
              message: [new foxes.Message.Plain('字符串解析错误。')]
            })
          }
        }
        // 打开远程主机链接。
        const a = new xesremote.XesRemote({
          lang: xesremote.Language.Python,
          content: text,
          echo: false
        })
        await plug.bot.send('group', {
          qq: data.sender.group.id,
          message: [
            new foxes.Message.Image(
              await plug.bot.upload(['image', 'group'], {
                data: text2image(
                  await new Promise<string>(resolve => {
                    // 构造结果字符串。
                    let s = '以下是执行结果：\n'
                    a.onmessage = ev => {
                      // 处理回传。
                      if (ev.type == xesremote.MsgType.Output) {
                        // 正常输出。
                        s += ev.data.toString('utf-8')
                      } else {
                        // 其它消息。
                        s += `[${ev.type} Message ${ev.data.toString()}]\n`
                      }
                    }
                    a.onopen = async () => {
                      // 获得主机的ID。
                      s += `[Connected to ${await a.host()}]\n`
                      // 发送参数。
                      await a.send(args)
                      // 限时。
                      setTimeout(async () => {
                        await a.close()
                        return resolve(s + '\n运行超时。')
                      }, 10000)
                    }
                    // 连接关闭时，回传结果。
                    a.onclose = () => resolve(s)
                  }),
                  'error-font'
                ),
                suffix: 'png'
              })
            )
          ]
        })
      })
    )
    console.info('[INFO] 已加载 XesRemote。')
    console.info('[INFO] 本插件基于学而思提供的远程虚拟主机。请勿滥用。')
    return plug
  }
}
