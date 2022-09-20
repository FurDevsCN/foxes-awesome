# Foxes-Awesome

[mirai-foxes](https://github.com/FurDevsCN/mirai-foxes) 作者写的简单示例，支持一个简单 Logger，简易控制台，和三个小功能。

你可以将此示例作为 mirai-foxes 的学习材料，但也可以把它当成类似于 Python 那种包装过的 Bot 框架使用。

**此示例未经脱敏，内含敏感信息，作者完全免责。**

## 如何使用

```bash
npm i
npx ts-node src/index.ts
```

就可以了。

请按需更改 mirai-api-http 参数。

## Config

默认的 config 如下：

```json
{
  "general": {
    "admin": [3191632795]
  }
}
```

- `general`：一般设置。
- `general.admin`：管理员列表。请把自带的QQ号换成你的名字。

## 注意

本项目的 Text2Image 使用了 [霞鹜文楷](https://github.com/lxgw/LxgwWenKai/) 作为字体，其使用了 **SIL Open Font License 1.1** 作为开源协议，这意味着您需要遵守：

1. 允许个人使用或商业使用，但作者不承担责任，也没有任何担保。
2. 使用时必须注明使用了此字体，且修改/二次发行时需使用相同的开源协议。

若您不同意本协议，您可以替换`src/res/font.ttf`为其它字体。
