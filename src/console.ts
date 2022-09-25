/**
 * 此模块负责实现命令系统。
 */
import { Plugin, PluginManager } from 'foxes-plugin' // 导入必要的负责插件处理的内容。
import { getPlugin, getPlugins, exit } from './module' // 导入获取插件（用于插件重载）/退出的函数。
import { createInterface, Interface } from 'readline' // 导入获取用户输入的方法。
/**
 * 负责处理控制台输入。
 * @param plug 插件表。
 * @param config 命令配置。
 * @param input 用户输入。
 */
async function handler(
  plug: PluginManager, // 在主函数中初始化的插件管理器。
  config: Record<string, unknown>, // 读入的配置。
  input: string // 用户的输入。
): Promise<void> {
  // 简单地解析用户输入，这里仅以空格分割，不考虑转义或者引号。
  const cmd: string[] = input.split(' ')
  // 访问解析后的第一个元素，也即用户命令。
  switch (cmd[0]) {
    // 退出进程。
    case 'exit': {
      // 告诉用户进程将要停止。
      console.log('停止')
      // 退出。
      exit(config)
      break
    }
    // 显示帮助。
    case 'help': {
      // 显示一个代表帮助的表格。
      console.table({
        help: '显示帮助',
        'exit': '停止插件管理器',
        disable: '停用插件。',
        list: '显示所有启用的插件。',
        enable: '启用插件。',
        'enable-all': '启用所有插件。'
      })
      break
    }
    // 禁用插件。
    case 'disable': {
      // 强制要求命令的参数为 1（不含命令本身）。
      if (cmd.length != 2) {
        console.error(`要求 1 个参数但提供了 ${cmd.length - 1} 个`)
        break
      }
      // 删除指定插件。
      if (plug.remove(cmd[1])) {
        // 删除成功的情况
        console.info(`[INFO] 停用了插件 ${cmd[1]}。`)
      } else {
        // 删除失败的情况
        console.error(`无法停用 ${cmd[1]}，因为其未被加载或不存在。`)
      }
      break
    }
    // 启用插件。
    case 'enable': {
      // 强制要求命令的参数为 1（不含命令本身）。
      if (cmd.length != 2) {
        console.error(`要求 1 个参数但提供了 ${cmd.length - 1} 个`)
        break
      }
      try {
        // 获得插件。此操作可能失败。
        const a = await getPlugin(cmd[1])
        plug.install(a.name, a.init(new Plugin(plug), config)) // 安装插件。
        console.info(`[INFO] 启用了插件 ${cmd[1]}。`)
      } catch (_) {
        // 获取失败的情况
        console.error(`无法加载 ${cmd[1]}，因为其不存在。`)
      }
      break
    }
    // 启用所有的插件。
    case 'enable-all': {
      console.info('[INFO] 正在启用所有插件')
      ;(await getPlugins()).forEach(value => {
        plug.install(value.name, value.init(new Plugin(plug), config))
      }) // 效果同主函数中的插件加载。
      console.info('[INFO] 启用完成')
      break
    }
    // 列出所有插件。
    case 'list': {
      console.info('所有可用插件列表如下：')
      // 获得所有插件的名称。
      console.table(plug.plugins.keys())
      break
    }
    // 不输入的情况
    case '': {
      // pass
      break
    }
    // 未知命令处理。
    default: {
      // 提示用户命令不存在。
      console.log(`未知的命令 ${cmd[0]}. 输入 'help' 来获得帮助。`)
    }
  }
}
/**
 * @description 负责调用handler并要求下一次输入。
 * @param std 输入流。
 * @param plug 插件表。
 * @param config 配置。
 * @param input 用户输入。
 */
async function _handler(
  std: Interface,
  plug: PluginManager,
  config: Record<string, unknown>,
  input: string
): Promise<void> {
  await handler(plug, config, input) // 先处理本次的输入。
  std.question(
    '> ', // 提示符。
    _handler.bind(null, std, plug, config) // 绑定需要的参数。绑定后，函数的定义变为(input: string): Promise<void>，符合std.question的回调格式。
  ) // 准备下一次输入。
}
/**
 * @description 初始化控制台。
 * @param plug 插件表。
 * @param config 配置。
 */
export function init(
  plug: PluginManager,
  config: Record<string, unknown>
): void {
  const std: Interface = createInterface({
    input: process.stdin,
    output: process.stdout
  }) // 创建输入流。
  // Ctrl+C的情况。
  process.on('SIGINT', () => {
    console.info('停止')
    // 退出。
    exit(config)
  })
  // Ctrl+D的情况。
  std.on('close', () => {
    console.info('停止')
    // 退出。
    exit(config)
  })
  // 准备第一次输入。
  std.question('> ', _handler.bind(null, std, plug, config))
}
