import { Plugin } from 'foxes-plugin'
let _lastGroup = 0
export default {
  name: 'logger',
  init(plug: Plugin): Plugin {
    plug.on('GroupMessage', async data => {
      if (data.sender.group.id != _lastGroup) {
        if (_lastGroup != 0) console.log('\r}')
        _lastGroup = data.sender.group.id
        console.log(
          `\rGroup ${data.sender.group.id}(${data.sender.group.name}): {`
        )
      }
      let str = `\r  ${data.sender.id}(${
        data.sender.memberName
      }): ${JSON.stringify(data.messageChain)}`
      console.log(str)
      process.stdout.write('\r}')
    })
    console.info('[INFO] 已加载 Logger。')
    console.info('[INFO] 本实现借鉴了 mjsmgr。')
    return plug
  }
}
