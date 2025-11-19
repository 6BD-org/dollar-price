import { getBocExchangeRate, getBOCHKExchangeRate } from '../lib/exchange-rate'


export const GET = async () => {
  const result = await Promise.all([getBocExchangeRate(), getBOCHKExchangeRate()]).then(v => v.join('\n'))
  return new Response(result, {
    status: 200,
  })
}

