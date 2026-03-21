'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getCart, getCartTotal, clearCart } from '../../lib/cart'
import { apiRequest } from '../../lib/api'

export default function Checkout() {
  const router = useRouter()
  const [cart, setCart] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [address, setAddress] = useState({
    street: '',
    city: '',
    state: '',
    pincode: ''
  })

  useEffect(() => {
    const cartData = getCart()
    if (cartData.length === 0) {
      router.push('/cart')
      return
    }
    setCart(cartData)

    const user = localStorage.getItem('user')
    if (!user) {
      router.push('/login')
    }
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddress({ ...address, [e.target.name]: e.target.value })
  }

  const handleCheckout = async () => {
    if (!address.street || !address.city || !address.state || !address.pincode) {
      setError('Please fill in all address fields')
      return
    }

    setLoading(true)
    setError('')

    try {
        const token = localStorage.getItem('token') || ''

      const items = cart.map((item: any) => ({
        productId: item._id,
        quantity: item.quantity
      }))

  const order = await apiRequest('/api/orders', 'POST', {
  items,
  shippingAddress: address
} as any, token)

      clearCart()
      router.push(`/orders/${order._id}`)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Checkout</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

        {/* Address Form */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Shipping Address</h2>

          {error && (
            <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Street Address
              </label>
              <input
                type="text"
                name="street"
                value={address.street}
                onChange={handleChange}
                placeholder="123 MG Road"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                City
              </label>
              <input
                type="text"
                name="city"
                value={address.city}
                onChange={handleChange}
                placeholder="Delhi"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                State
              </label>
              <input
                type="text"
                name="state"
                value={address.state}
                onChange={handleChange}
                placeholder="Delhi"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Pincode
              </label>
              <input
                type="text"
                name="pincode"
                value={address.pincode}
                onChange={handleChange}
                placeholder="110001"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-4">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Order Summary</h2>
            <div className="space-y-2 mb-4">
              {cart.map((item: any) => (
                <div key={item._id} className="flex justify-between text-sm text-gray-600">
                  <span>{item.title} x{item.quantity}</span>
                  <span>₹{item.price * item.quantity}</span>
                </div>
              ))}
            </div>
            <div className="border-t pt-4">
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span className="text-orange-600">₹{getCartTotal()}</span>
              </div>
            </div>
          </div>

          <div className="bg-orange-50 rounded-xl p-4 mb-4 flex items-center gap-3">
            <span className="text-2xl">🤝</span>
            <p className="text-sm text-gray-700">
              Payment goes directly to the artisan — no middlemen
            </p>
          </div>

          <button
            onClick={handleCheckout}
            disabled={loading}
            className="w-full bg-orange-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-orange-700 disabled:opacity-50"
          >
            {loading ? 'Placing Order...' : `Place Order — ₹${getCartTotal()}`}
          </button>
        </div>
      </div>
    </div>
  )
}