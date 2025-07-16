interface ExchangeRateData {
  bank: string
  buyRate: string
  sellRate: string
  updateTime: string
}

async function fetchExchangeRates(): Promise<{ rates: ExchangeRateData[], error?: string }> {
  try {
    const result = await Promise.all([getBocExchangeRate(), getBOCHKExchangeRate()]).then(v => v.join('\n'))
    const rates = parseRatesText(result)
    return { rates }
  } catch (err) {
    return { 
      rates: [], 
      error: err instanceof Error ? err.message : 'An error occurred' 
    }
  }
}

function parseRatesText(text: string): ExchangeRateData[] {
  const lines = text.split('\n').filter(line => line.trim())
  const rates: ExchangeRateData[] = []
  
  let currentRate: Partial<ExchangeRateData> = {}
  
  lines.forEach(line => {
    if (line.includes('中国银行')) {
      currentRate = { bank: 'Bank of China' }
    } else if (line.includes('中银香港')) {
      currentRate = { bank: 'BOCHK' }
    } else if (line.includes('现汇买入价:')) {
      currentRate.buyRate = line.split(':')[1].trim()
    } else if (line.includes('现汇卖出价:')) {
      currentRate.sellRate = line.split(':')[1].trim()
    } else if (line.includes('发布时间:')) {
      currentRate.updateTime = line.split(':').slice(1).join(':').trim()
      if (currentRate.bank && currentRate.buyRate && currentRate.sellRate) {
        rates.push(currentRate as ExchangeRateData)
      }
    }
  })
  
  return rates
}

import { getBocExchangeRate, getBOCHKExchangeRate } from '../dollar/route'
import RefreshButton from './RefreshButton'

export default async function ExchangeRate() {
  const { rates, error } = await fetchExchangeRates()
  const lastUpdated = new Date()

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">USD/CNY Exchange Rates</h1>
        <RefreshButton />
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          <p className="font-semibold">Error</p>
          <p>{error}</p>
        </div>
      )}

      {rates.length === 0 && !error ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-500">No exchange rate data available</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {rates.map((rate, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow duration-300"
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-800">{rate.bank}</h2>
                  <div className="w-3 h-3 rounded-full bg-green-400"></div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600">Buy Rate</span>
                    <span className="text-lg font-bold text-green-600">{rate.buyRate}</span>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600">Sell Rate</span>
                    <span className="text-lg font-bold text-red-600">{rate.sellRate}</span>
                  </div>
                  
                  <div className="text-sm text-gray-500 mt-4">
                    <p>Updated: {rate.updateTime}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center text-sm text-gray-500">
            <p>Last refreshed at {lastUpdated.toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit'
            })}</p>
          </div>
        </>
      )}
    </div>
  )
}