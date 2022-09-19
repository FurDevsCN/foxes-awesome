import canvas from 'canvas'
/**
 * 自动折行
 * @param text 按换行切分的文字
 * @param max 单行最大文字数
 * @returns 处理完成的文字
 */
function processArr(text: string[], max: number): string[] {
  let fin: string[] = []
  for (const e of text) {
    let temp = ''
    for (let i = 0, sum = 0; i < e.length; i++, sum++) {
      if (sum > max) {
        fin.push(temp)
        temp = ''
        sum = 0
      }
      temp += e[i]
      if (!/^[\x00-\x7F]+$/.test(e[i])) {
        sum += 1
      }
    }
    if (temp != '') fin.push(temp)
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
  const fsize = 30 // px
  const textArr = processArr(text.split('\n'), 98)
  let c: canvas.Canvas = new canvas.Canvas(
    50 * fsize,
    (textArr.length + 3) * fsize
  )
  const context = c.getContext('2d')
  context.imageSmoothingEnabled = true
  context.fillStyle = '#a9a9a9'
  context.fillRect(0, 0, c.width, c.height)
  context.fillStyle = '#000'
  context.font = `normal ${fsize}px ${font}`
  context.textAlign = 'start'
  context.textBaseline = 'top'
  let offset = 0
  for (const d of textArr) {
    context.fillText(d, 0, offset)
    offset += fsize
  }
  return c.toBuffer('image/png')
}
