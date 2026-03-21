export const getCart = () => {
  if (typeof window === 'undefined') return []
  const cart = localStorage.getItem('cart')
  return cart ? JSON.parse(cart) : []
}

export const addToCart = (product, quantity = 1) => {
  const cart = getCart()
  const existingItem = cart.find(item => item._id === product._id)

  if (existingItem) {
    existingItem.quantity += quantity
  } else {
    cart.push({ ...product, quantity })
  }

  localStorage.setItem('cart', JSON.stringify(cart))
  return cart
}

export const removeFromCart = (productId) => {
  const cart = getCart().filter(item => item._id !== productId)
  localStorage.setItem('cart', JSON.stringify(cart))
  return cart
}

export const clearCart = () => {
  localStorage.removeItem('cart')
}

export const getCartTotal = () => {
  return getCart().reduce((total, item) => total + item.price * item.quantity, 0)
}

export const getCartCount = () => {
  return getCart().reduce((count, item) => count + item.quantity, 0)
}
