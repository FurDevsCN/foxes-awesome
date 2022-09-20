/**
 * 简易日志系统，用于显示用户的群聊消息。
 */
import { Plugin } from 'foxes-plugin'
// 最后一个群聊。用于控制输出。
let _lastGroup = 0
export default {
  name: 'logger', // 插件名称。
  init(plug: Plugin): Plugin {
    plug.on('GroupMessage', async data => {
      if (data.sender.group.id != _lastGroup) {
        if (_lastGroup != 0) console.log('\r}') // 上一个事件和此事件的群聊不符。结束上一个事件。
        _lastGroup = data.sender.group.id // 重新设定上一个事件的群聊。
        console.log(
          `\rGroup ${data.sender.group.id}(${data.sender.group.name}): {`
        ) // 输出群聊上下文。
      }
      // 构造用户在群聊中的消息，并输出到控制台。
      console.log(
        `\r  ${data.sender.id}(${data.sender.memberName}): ${JSON.stringify(
          data.messageChain
        )}`
      )
      // 在原始输出中写入一个结束符。若接下来的事件仍在同一个群聊，则此结束符被覆盖。
      process.stdout.write('\r}')
    }) // 监控群聊消息。
    // 提示部署者此插件已经被加载。非强制。
    console.info('[INFO] 已加载 Logger。')
    console.info('[INFO] 本实现借鉴了 mjsmgr。')
    return plug
  }
}
