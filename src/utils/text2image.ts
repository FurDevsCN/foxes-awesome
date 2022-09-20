import canvas from 'canvas'
/**
 * 自动折行。
 * @param text 按换行切分的文字
 * @param max 单行最大文字数
 * @returns 处理完成的文字
 */
function processArr(text: string[], max: number): string[] {
  // 此函数的作用是在字数超过最大限制时切割字符串。
  const fin: string[] = []
  const reg = new RegExp('/^[\\0-\\x7F]+$/')
  for (const e of text) {
    let temp = ''
    for (let i = 0, sum = 0; i < e.length; i++) {
      if (sum > max) {
        // 字数超过最大限制。
        fin.push(temp) // 将临时字符串加入最终返回，也即切割。
        temp = '' // 将临时字符串置空。
        sum = 0 // 重置字数计数。
      }
      temp += e[i] // 将临时字符串加上当前字符串。
      if (!reg.test(e[i])) {
        sum += 2 // 如果当前字符串不是ASCII，则将字数计数器加上2而不是1（防止画布越界）。
      } else {
        sum++ // 字数计数器+1
      }
    }
    if (temp != '') fin.push(temp) // 如果临时字符串仍有残留，就新开一行。
  }
  return fin
}
/**
 * text转图片Buffer
 * @param text 文件
 * @param font 字体
 * @returns png图片
 */
export default (text: string, font: string): Buffer => {
  // 设定文字大小为30px。
  const fsize = 30 // px
  // 设置单行最大字符数为98，并把文本以换行符切割。
  const textArr = processArr(text.split('\n'), 98)
  // 创建画布
  const c: canvas.Canvas = new canvas.Canvas(
    50 * fsize, // 预留50*30px（约等于98个字符）。
    (textArr.length + 3) * fsize // 在原行的基础上再预留3行（实际表现效果比3行大）。
  )
  const context = c.getContext('2d') // 获得画布的2D上下文。
  context.imageSmoothingEnabled = true // 启用抗锯齿。
  context.fillStyle = '#a9a9a9' // 设置背景颜色为#a9a9a9。
  context.fillRect(0, 0, c.width, c.height) // 填充背景。
  context.fillStyle = '#000' // 设置文本颜色为#000。
  context.font = `normal ${fsize}px ${font}` // 设置文本的大小和字体。
  context.textAlign = 'start' // 设置文本对齐。
  context.textBaseline = 'top' // 设置文本从上方开始还是从下方开始。
  let offset = 0 // 绘制文本的y轴偏移。
  for (const d of textArr) {
    context.fillText(
      d, // 要填充的文本。
      0, // x轴（这里设置为0，即图像的开始位置）。
      offset // y轴偏移。
    ) // 填充文本。
    offset += fsize // 将y轴移到下一行。
  }
  return c.toBuffer('image/png') // 将图片转为image/png格式，并返回Buffer。
}
