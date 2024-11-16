import * as cheerio from 'cheerio'

export const dynamic = 'force-dynamic'

export const GET = async () => {
  const result = await Promise.all([getBocExchangeRate(), getBOCHKExchangeRate()]).then(v => v.join('\n'))
  return new Response(result, {
    status: 200,
  })
}

const getBocExchangeRatePage0 = async () => {
  const html = await fetch("https://www.boc.cn/SOURCEDB/WHPJ/index.html", {
    cache: 'no-store'
  }).then(v => v.text())
  const $ = cheerio.load(html)
  const table = $('div.BOC_main').find('table').find('tbody').find('tr').filter((i, e) => {
    return $(e).find('td').eq(0).text().trim() === '美元'
  }).text().split('\n').map(item => item.trim()).filter(Boolean)
  return table.filter(Boolean)
}

const getBocExchangeRatePage1 = async () => {
  const html = await fetch("https://www.boc.cn/SOURCEDB/WHPJ/index_1.html", {
    cache: 'no-store'
  }).then(v => v.text())
  const $ = cheerio.load(html)
  const table = $('div.BOC_main').find('table').find('tbody').find('tr').filter((i, e) => {
    return $(e).find('td').eq(0).text().trim() === '美元'
  }).text().split('\n').map(item => item.trim()).filter(Boolean)
  return table.filter(Boolean)
}


const getBocExchangeRate = async () => {
  const [table1, table2] = await Promise.all([getBocExchangeRatePage0(), getBocExchangeRatePage1()])
  const table = table1.length > 0 ? 
    table1 : table2.length > 0 ? table2 : null
  if(!table) return `未爬取到美元数据`
  return `中国银行${table[0]}汇率\n现汇买入价: ${table[1]}\n现汇卖出价: ${table[3]}\n发布时间: ${table[6]}\n`
}

const getBOCHKExchangeRate = async () => {
  const html = await fetch("https://www.bochk.com/whk/rates/exchangeRatesUSD/exchangeRatesUSD-input.action", {
    cache: 'no-store'
  }).then(v => v.text())
  const $ = cheerio.load(html)
  const table = $('#form-div > form > div > table.form_table.import-data.second-right > tbody > tr:nth-child(7)').text().replace(/\t/g, '').split('\n').map(item => item.trim()).filter(Boolean)
  const time = $('#form-div > form > div > table:nth-child(2) > tbody > tr:nth-child(1) > td > b').text().replace("Information last updated at HK Time:", '').trim()
  return `中银香港美元汇率\n现汇买入价: ${table[1]}\n现汇卖出价: ${table[2]}\n发布时间: ${time}`
}