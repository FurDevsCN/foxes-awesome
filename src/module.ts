/**
 * 此模块负责加载所有的插件。
 */
import { Plugin } from 'foxes-plugin' // 引入需要的插件
import { readdirSync, writeFileSync } from 'fs' // 读写文件/文件夹需要用到的API
/**
 * 标准自定义插件。
 * foxes-plugin 不强制使用此种方法定义插件。您可以按个人喜好完成 模块结构 的设计。
 */
export interface Module {
  name: string // 插件的名字。
  init(
    plug: Plugin, // 插件实例。插件由 new Plugin(plugin_manager) 生成。注意：您不应当将 PluginManager 传给 init，因为这可能导致插件滥用权限。仅当信任插件（如包管理器）时才给插件 PluginManager 对象。
    config: Record<string, unknown> // 公共配置。由于不确定其中的内容，所以插件应对“配置可能为空”的情况做处理。拒绝加载包括在处理中。
  ): Plugin // 初始化模块的方法。
}
/**
 * 获得单个插件。
 * @param name 插件名。
 * @returns 插件。
 */
export async function getPlugin(name: string): Promise<Module> {
  // 导入指定插件的 Typescript 文件，然后将其默认导出强制转换为 Module。这意味着插件的默认导出必须符合 Module Interface 的格式。
  // Hint: 可以利用 export default {...} as Module 确认是否符合格式。若不符合格式，Typescript 将会提示您类型未充分重叠。
  return (await import(`./plugins/${name}/index.ts`)).default as Module
}
/**
 * 获得所有插件。
 * @returns 插件数组。
 */
export async function getPlugins(): Promise<Module[]> {
  // 获得插件目录的列表。插件的目录虽然不代表插件名，但建议将插件名和插件目录统一命名。
  const pluginList: string[] = readdirSync('src/plugins')
  // 空数组，用于存放即将被导入的插件。
  const pl: Module[] = []
  for (const data of pluginList) {
    // 将导入了的插件加入插件数组中。
    pl.push(await getPlugin(data))
  }
  // 提示用户插件的个数。
  console.log(`[INFO] 共读取 ${pl.length} 个插件`)
  // 返回所有已经加载的插件。
  return pl
}
/**
 * 保存配置并关闭程序。
 * @param config 配置。
 */
export function exit(config: Record<string, unknown>): void {
  // 将可能被插件更改的 config 重新写回配置文件。此操作是可选的。如果不希望配置文件被插件更改，请注释下面的一行。
  writeFileSync('src/config.json', JSON.stringify(config, undefined, 2))
  // 退出进程。此条语句后的内容将无法被访问到。
  process.exit(0)
}
