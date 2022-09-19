import { Plugin } from 'foxes-plugin'
import * as foxes from 'mirai-foxes'
import text2image from '../../utils/text2image'
import * as xesremote from './xesremote'
export default {
  name: 'xesremote',
  init(plug: Plugin): Plugin {
    plug.on(
      'GroupMessage',
      foxes.Middleware.Middleware<'GroupMessage'>({
        matcher: [
          // foxes.Middleware.templateMatch(['Plain']),
          foxes.Middleware.prefixMatch('.cpp')
        ]
      })(async data => {
        let text = (data.messageChain[1] as foxes.Message.Plain).text
        let argsraw = text.substring(0, text.indexOf('\n'))
        let args: string = ''
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
                    let s = '以下是执行结果：\n'
                    a.onmessage = ev => {
                      if (ev.type == xesremote.MsgType.Output) {
                        s += ev.data.toString('utf-8')
                      } else {
                        s += `[${ev.type} Message ${ev.data.toString()}]\n`
                      }
                    }
                    a.onopen = async () => {
                      s += `[Connected to ${await a.host()}]\n`
                      await a.send(args)
                      setTimeout(async () => {
                        await a.close()
                        return resolve(s + '\n运行超时。')
                      }, 10000)
                    }
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
    plug.on(
      'GroupMessage',
      foxes.Middleware.Middleware<'GroupMessage'>({
        matcher: [
          // foxes.Middleware.templateMatch(['Plain']),
          foxes.Middleware.prefixMatch('.python')
        ]
      })(async data => {
        let text = (data.messageChain[1] as foxes.Message.Plain).text
        let argsraw = text.substring(0, text.indexOf('\n'))
        let args: string = ''
        text = text.substring(text.indexOf('\n') + 1)
        if (argsraw.indexOf(' ') != -1) {
          try {
            args = JSON.parse(argsraw.substring(argsraw.indexOf(' ') + 1))
            if (typeof args != 'string') throw new Error()
          } catch (_) {
            return void (await plug.bot.send('group', {
              qq: data.sender.group.id,
              reply: data,
              message: [new foxes.Message.Plain('字符串解析错误。')]
            }))
          }
        }
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
                    let s = '以下是执行结果：\n'
                    a.onmessage = ev => {
                      if (ev.type == xesremote.MsgType.Output) {
                        s += ev.data.toString('utf-8')
                      } else {
                        s += `[${ev.type} Message ${ev.data.toString()}]\n`
                      }
                    }
                    a.onopen = async () => {
                      s += `[Connected to ${await a.host()}]\n`
                      await a.send(args)
                      setTimeout(async () => {
                        await a.close()
                        return resolve(s + '\n运行超时。')
                      }, 10000)
                    }
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
