export default function Home() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">
          Premium PSA Pokémon Cards
        </h1>
        <p className="text-lg text-gray-400 mb-6">
          Authentic graded cards from trusted collectors. Final sale marketplace.
        </p>
        <a href="/products" className="btn btn-primary text-lg px-6 py-3">
          Browse Cards
        </a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
        <div className="card text-center">
          <div className="text-4xl mb-4">✓</div>
          <h3 className="text-lg font-bold mb-2">Verified Sellers</h3>
          <p className="text-gray-400">
            All products verified and authenticated before listing.
          </p>
        </div>
        <div className="card text-center">
          <div className="text-4xl mb-4">🔒</div>
          <h3 className="text-lg font-bold mb-2">Secure Payment</h3>
          <p className="text-gray-400">
            PromptPay payment verification system for buyer protection.
          </p>
        </div>
        <div className="card text-center">
          <div className="text-4xl mb-4">📦</div>
          <h3 className="text-lg font-bold mb-2">Fast Delivery</h3>
          <p className="text-gray-400">
            Secure packaging and tracking for every order.
          </p>
        </div>
      </div>

      <section className="mt-16 py-8 border-t border-dark-800">
        <h2 className="text-2xl font-bold mb-6">Featured Cards</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Placeholder for featured products */}
          {[...Array(8)].map((_, i) => (
            <div key={i} className="card">
              <div className="bg-dark-800 h-48 rounded mb-3 skeleton" />
              <div className="h-4 bg-dark-800 rounded mb-2 skeleton" />
              <div className="h-4 bg-dark-800 rounded w-3/4 mb-4 skeleton" />
              <div className="h-8 bg-dark-800 rounded skeleton" />
            </div>
          ))}
        </div>
      </section>

      <section className="mt-16 py-8 bg-dark-900 border border-dark-800 rounded-lg px-8">
        <h2 className="text-2xl font-bold mb-4">Final Sale Policy</h2>
        <p className="text-gray-400 mb-4">
          All sales are final. No returns, exchanges, or refunds. By completing a purchase, you agree to this policy.
        </p>
        <p className="text-gray-400">
          Products are carefully described and photographed. Please review all details before purchasing.
        </p>
      </section>
    </div>
  )
}
