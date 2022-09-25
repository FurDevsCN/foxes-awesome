# Foxes-Awesome

[mirai-foxes](https://github.com/FurDevsCN/mirai-foxes) 作者写的简单示例，支持一个简单 Logger，简易控制台，和三个小功能。

你可以将此示例作为 mirai-foxes 的学习材料，但也可以把它当成类似于 Python 那种包装过的 Bot 框架使用。

**此示例未经脱敏，内含敏感信息，作者完全免责。**

## 如何使用

```bash
sudo apt-get install build-essential libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev librsvg2-dev # 安装 canvas 必要依赖，see https://github.com/Automattic/node-canvas#readme
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

## Playwright 支持

我们在 `foxes-awesome 1.0.1` 引入了对 Playwright 的需求以实现帮助，但 Playwright 极为吃配置，因此建议您量力而行。

另注，Javascript 可以完成几乎所有 Python 可以做的操作（比如这个算在内），就算无法完成也可以使用 Command Line Interface 调用 Python，由于 Python 在运行性能方面表现极差，故我们建议您 **不要听信他人让您使用 Python 框架重写的请求** 并 **只在必要时调用 Python**。这样，您机器人的速度将会大幅度提升，对性能的需求也会减小很多。

## 警告

本项目的初始示例之一——网页预览不包含鉴权或者网址屏蔽。请自行承担后果，或者手动添加检测。
