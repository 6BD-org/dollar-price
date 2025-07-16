import ExchangeRate from './components/ExchangeRate'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto py-12">
        <ExchangeRate />
      </div>
    </main>
  )
}