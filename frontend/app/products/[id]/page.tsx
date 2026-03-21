'use client'
import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { apiRequest } from '../../../lib/api'
import { addToCart } from '../../../lib/cart'

export default function ProductDetail() {
  const { id } = useParams()
  const router = useRouter()
  const [product, setProduct] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await apiRequest(`/api/products/${id}`)
        setProduct(data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    if (id) fetchProduct()
  }, [id])

  const handleAddToCart = () => {
    addToCart(product, quantity)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  if (loading) return (
    <div className="text-center py-20 text-gray-500">Loading product...</div>
  )

  if (!product) return (
    <div className="text-center py-20 text-gray-500">Product not found</div>
  )

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

        {/* Product Image */}
        <div className="bg-orange-50 rounded-2xl h-96 flex items-center justify-center">
          {product.image ? (
            <img
              src={product.image}
              alt={product.title}
              className="h-full w-full object-cover rounded-2xl"
            />
          ) : (
            <span className="text-9xl">🏺</span>
          )}
        </div>

        {/* Product Info */}
        <div>
          <p className="text-orange-600 font-medium mb-1">{product.category}</p>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">{product.title}</h1>
          <p className="text-gray-500 mb-1">
            by <span className="font-medium">{product.seller?.name}</span>
          </p>
          <p className="text-4xl font-bold text-orange-600 mb-4">₹{product.price}</p>
          <p className="text-gray-600 mb-6 leading-relaxed">{product.description}</p>

          {/* Stock */}
          <p className={`text-sm font-medium mb-4 ${product.stock > 0 ? 'text-green-600' : 'text-red-500'}`}>
            {product.stock > 0 ? `✓ ${product.stock} items in stock` : '✗ Out of stock'}
          </p>

          {/* Quantity */}
          {product.stock > 0 && (
            <div className="flex items-center gap-4 mb-6">
              <span className="text-gray-700 font-medium">Quantity:</span>
              <div className="flex items-center border border-gray-300 rounded-lg">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-l-lg"
                >
                  -
                </button>
                <span className="px-4 py-2 font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-r-lg"
                >
                  +
                </button>
              </div>
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-4">
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className={`flex-1 py-3 rounded-lg font-medium transition-colors ${
                added
                  ? 'bg-green-600 text-white'
                  : 'bg-orange-600 text-white hover:bg-orange-700'
              } disabled:opacity-50`}
            >
              {added ? '✓ Added to Cart!' : 'Add to Cart'}
            </button>
            <button
              onClick={() => router.push('/cart')}
              className="flex-1 border-2 border-orange-600 text-orange-600 py-3 rounded-lg font-medium hover:bg-orange-50"
            >
              View Cart
            </button>
          </div>

          {/* Direct from artisan badge */}
          <div className="mt-6 bg-orange-50 rounded-xl p-4 flex items-center gap-3">
            <span className="text-2xl">🤝</span>
            <div>
              <p className="font-medium text-gray-800">Direct from artisan</p>
              <p className="text-sm text-gray-500">Your payment goes directly to {product.seller?.name}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}