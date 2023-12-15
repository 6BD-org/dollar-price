import * as cheerio from 'cheerio'

export const GET = async () => {
  const html = await fetch("https://srh.bankofchina.com/search/whpj/search_cn.jsp?pjname=美元").then(v => v.text())
  const $ = cheerio.load(html)
  const table = $('body > div.wrapper > div.BOC_main.publish > table > tbody > tr:nth-child(2)').text().split('\n').map(item => item.trim()).filter(Boolean)
  const result = `${table[0]}汇率\n现汇买入价：${table[1]}\n现汇卖出价: ${table[3]}\n发布时间: ${table[6]}`
  return new Response(result, {
    status: 200,
  })
}