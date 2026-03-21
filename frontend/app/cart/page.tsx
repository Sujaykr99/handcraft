'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { getCart, removeFromCart, getCartTotal } from '../../lib/cart'

export default function Cart() {
  const [cart, setCart] = useState<any[]>([])

  useEffect(() => {
    setCart(getCart())
  }, [])

  const handleRemove = (productId: string) => {
    const updated = removeFromCart(productId)
    setCart(updated)
  }

  if (cart.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-6xl mb-4">🛒</p>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Your cart is empty</h2>
        <p className="text-gray-500 mb-6">Add some handmade items to get started</p>
        <Link
          href="/products"
          className="bg-orange-600 text-white px-8 py-3 rounded-lg hover:bg-orange-700"
        >
          Browse Products
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Your Cart</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

        {/* Cart Items */}
        <div className="md:col-span-2 space-y-4">
          {cart.map((item: any) => (
            <div
              key={item._id}
              className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex gap-4"
            >
              <div className="bg-orange-50 rounded-lg w-20 h-20 flex items-center justify-center flex-shrink-0">
                {item.image ? (
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover rounded-lg" />
                ) : (
                  <span className="text-3xl">🏺</span>
                )}
              </div>

              <div className="flex-1">
                <h3 className="font-semibold text-gray-800">{item.title}</h3>
                <p className="text-sm text-gray-500">{item.category}</p>
                <p className="text-orange-600 font-bold">₹{item.price}</p>
                <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
              </div>

              <div className="flex flex-col justify-between items-end">
                <p className="font-bold text-gray-800">₹{item.price * item.quantity}</p>
                <button
                  onClick={() => handleRemove(item._id)}
                  className="text-red-500 hover:text-red-700 text-sm"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 h-fit">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Order Summary</h2>

          <div className="space-y-2 mb-4">
            {cart.map((item: any) => (
              <div key={item._id} className="flex justify-between text-sm text-gray-600">
                <span>{item.title} x{item.quantity}</span>
                <span>₹{item.price * item.quantity}</span>
              </div>
            ))}
          </div>

          <div className="border-t pt-4 mb-6">
            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span className="text-orange-600">₹{getCartTotal()}</span>
            </div>
          </div>

          <Link
            href="/checkout"
            className="block w-full bg-orange-600 text-white py-3 rounded-lg font-medium text-center hover:bg-orange-700"
          >
            Proceed to Checkout
          </Link>

          <Link
            href="/products"
            className="block w-full text-center text-orange-600 mt-3 hover:underline"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  )
}