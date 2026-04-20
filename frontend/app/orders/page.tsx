'use client'
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { apiRequest } from '@/lib/api'

export default function OrderConfirmation() {
  const { id } = useParams()
  const [order, setOrder] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const token = localStorage.getItem('token') || ''
      const data = await apiRequest(`/api/orders/${id}`, 'GET', undefined as any, token)
        setOrder(data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    if (id) fetchOrder()
  }, [id])

  if (loading) return <div className="text-center py-20 text-gray-500">Loading order...</div>
  if (!order) return <div className="text-center py-20 text-gray-500">Order not found</div>

  return (
    <div className="max-w-2xl mx-auto px-6 py-10 text-center">
      <div className="text-6xl mb-4">🎉</div>
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Order Placed!</h1>
      <p className="text-gray-500 mb-8">
        Thank you! Your order has been placed successfully.
      </p>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 text-left mb-6">
        <h2 className="text-lg font-bold text-gray-800 mb-4">Order Details</h2>
        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex justify-between">
            <span>Order ID</span>
            <span className="font-mono text-xs">{order._id}</span>
          </div>
          <div className="flex justify-between">
            <span>Status</span>
            <span className="capitalize font-medium text-orange-600">{order.status}</span>
          </div>
          <div className="flex justify-between">
            <span>Total Amount</span>
            <span className="font-bold text-orange-600">₹{order.totalAmount}</span>
          </div>
          <div className="flex justify-between">
            <span>Seller</span>
            <span>{order.seller?.name}</span>
          </div>
        </div>

        <div className="border-t mt-4 pt-4">
          <h3 className="font-medium text-gray-800 mb-2">Items</h3>
          {order.items.map((item: any, i: number) => (
            <div key={i} className="flex justify-between text-sm text-gray-600">
              <span>{item.title} x{item.quantity}</span>
              <span>₹{item.price * item.quantity}</span>
            </div>
          ))}
        </div>

        <div className="border-t mt-4 pt-4">
          <h3 className="font-medium text-gray-800 mb-2">Shipping To</h3>
          <p className="text-sm text-gray-600">
            {order.shippingAddress?.street}, {order.shippingAddress?.city},
            {order.shippingAddress?.state} - {order.shippingAddress?.pincode}
          </p>
        </div>
      </div>

      <div className="flex gap-4 justify-center">
        <Link
          href="/products"
          className="bg-orange-600 text-white px-8 py-3 rounded-lg hover:bg-orange-700"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  )
}