import { Plugin, PluginManager } from 'foxes-plugin'
import { getPlugin, getPlugins } from './module'
import { createInterface, Interface } from 'readline'

/**
 * @description 负责处理请求。
 * @param plugins 插件表。
 * @param input 用户输入。
 */
async function handler(plug: PluginManager, input: string): Promise<void> {
  const cmd: string[] = input.split(' ')
  switch (cmd[0]) {
    case 'stop':
    case 'exit': {
      console.log('停止')
      process.exit(0)
    }
    case 'help': {
      console.table({
        help: '显示帮助',
        'stop (aka exit)': '停止插件管理器',
        disable: '停用插件。',
        list: '显示所有启用的插件。',
        enable: '启用插件。',
        'enable-all': '启用所有插件。'
      })
      break
    }
    case 'disable': {
      if (cmd.length != 2) {
        console.error(`要求 1 个参数但提供了 ${cmd.length - 1} 个`)
        break
      }
      if (plug.remove(cmd[1])) {
        console.info(`[INFO] 停用了插件 ${cmd[1]}。`)
      } else {
        console.error(`无法停用 ${cmd[1]}，因为其未被加载或不存在。`)
      }
      break
    }
    case 'enable': {
      if (cmd.length != 2) {
        console.error(`要求 1 个参数但提供了 ${cmd.length - 1} 个`)
        break
      }
      try {
        let a = await getPlugin(cmd[1])
        plug.install(a.name, a.init(new Plugin(plug)))
        console.info(`[INFO] 停用了插件 ${cmd[1]}。`)
      } catch (_) {
        console.error(`无法加载 ${cmd[1]}，因为其不存在。`)
      }
      break
    }
    case 'enable-all': {
      console.info('[INFO] 正在启用所有插件')
      ;(await getPlugins()).forEach(value => {
        plug.install(value.name, value.init(new Plugin(plug)))
      })
      console.info('[INFO] 启用完成')
      break
    }
    case 'list': {
      console.info('所有可用插件列表如下：')
      for (const a of plug.plugins.keys()) {
        console.log(a)
      }
      break
    }
    default: {
      console.log(`未知的命令 ${cmd[0]}. 输入 'help' 来获得帮助。`)
    }
  }
}
/**
 * @description 负责调用handler并要求下一次输入。
 * @param std 输入流。
 * @param plug 插件表。
 * @param input 用户输入。
 */
async function _handler(
  std: Interface,
  plug: PluginManager,
  input: string
): Promise<void> {
  await handler(plug, input)
  std.question('> ', _handler.bind(null, std, plug))
}
/**
 * @description 初始化控制台。
 * @param plug 插件表。
 */
export function init(plug: PluginManager): void {
  const std: Interface = createInterface({
    input: process.stdin,
    output: process.stdout
  })
  std.on('close', () => {
    console.info('Stopping')
    process.exit(0)
  })
  std.question('> ', _handler.bind(null, std, plug))
}
