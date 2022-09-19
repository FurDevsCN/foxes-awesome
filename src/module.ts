import { Plugin } from 'foxes-plugin'
import { readdirSync } from 'fs'
export interface Module {
  name: string
  init(plug: Plugin): Plugin
}
/**
 * 获得单个插件。
 * @param name 插件名。
 * @returns 插件。
 */
export async function getPlugin(name: string): Promise<Module> {
  return (await import(`./plugins/${name}/index.ts`)).default as Module
}
/**
 * @description 获得所有插件。
 */
export async function getPlugins(): Promise<Module[]> {
  const pluginList: string[] = readdirSync('src/plugins')
  const pl: Module[] = []
  for (const data of pluginList) {
    pl.push(await getPlugin(data))
  }
  console.log(`[INFO] 共读取 ${pl.length} 个插件`)
  return pl
}
