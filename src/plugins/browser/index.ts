/**
 * 显示一个帮助。
 */
import { chromium } from 'playwright'
import { Plugin } from 'foxes-plugin'
import * as foxes from 'mirai-foxes'
export default {
  name: 'browser', // 插件名称。
  init(plug: Plugin): Plugin {
    plug.on('GroupMessage',
      foxes.Middleware.Middleware<'GroupMessage'>({
        matcher: [
          foxes.Middleware.cmdMatch('.网页预览'),
          foxes.Middleware.templateMatch(['Plain', 'Plain'])
        ],
        parser: [
          foxes.Middleware.parseCmd
        ]
      })(async data=>{
        try {
          const browser = await chromium.launch()
          const page = await browser.newPage()
          await page.goto((data.messageChain[2] as foxes.Message.Plain).text)
          await plug.bot.send('group',{
            qq: data.sender.group.id,
            message: [new foxes.Message.Image(await plug.bot.upload(['image','group'], {
              data: await page.screenshot(),
              suffix: 'png'
            }))]
          })
          await browser.close()
        } catch(_) {
          await plug.bot.send('group', {
            qq: data.sender.group.id,
            message: [new foxes.Message.Plain('网页预览发生错误。请检查 URL 拼写，和机器人网络状态。')]
          })
        }
      })
    )
    // 提示部署者此插件已经被加载。非强制。
    console.info('[INFO] 已加载 网页预览(browser)。')
    return plug
  }
}
