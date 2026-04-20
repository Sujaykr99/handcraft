const express = require('express')
const router = express.Router()
const Order = require('../models/Order')
const Product = require('../models/Product')
const { protect, sellerOnly } = require('../middleware/auth')

router.post('/', protect, async (req, res) => {
  try {
    const { items, shippingAddress } = req.body
    if (!items || items.length === 0) return res.status(400).json({ message: 'No items in order' })
    let totalAmount = 0
    const orderItems = []
    let sellerId = null
    for (const item of items) {
      const product = await Product.findById(item.productId)
      if (!product) return res.status(404).json({ message: 'Product not found' })
      totalAmount += product.price * item.quantity
      sellerId = product.seller
      orderItems.push({ product: product._id, title: product.title, price: product.price, quantity: item.quantity, image: product.image })
    }
    const order = await Order.create({ buyer: req.user.id, seller: sellerId, items: orderItems, totalAmount, shippingAddress })
    res.status(201).json(order)
  } catch (error) { res.status(500).json({ message: error.message }) }
})

router.get('/my', protect, async (req, res) => {
  try {
    const orders = await Order.find({ buyer: req.user.id }).populate('seller', 'name email').sort({ createdAt: -1 })
    res.json(orders)
  } catch (error) { res.status(500).json({ message: error.message }) }
})

router.get('/seller', protect, sellerOnly, async (req, res) => {
  try {
    const orders = await Order.find({ seller: req.user.id }).populate('buyer', 'name email').sort({ createdAt: -1 })
    res.json(orders)
  } catch (error) { res.status(500).json({ message: error.message }) }
})

router.put('/:id/status', protect, sellerOnly, async (req, res) => {
  try {
    const { status } = req.body
    const order = await Order.findById(req.params.id)
    if (!order) return res.status(404).json({ message: 'Order not found' })
    order.status = status
    await order.save()
    res.json(order)
  } catch (error) { res.status(500).json({ message: error.message }) }
})

router.get('/:id', protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('seller', 'name email').populate('buyer', 'name email')
    if (!order) return res.status(404).json({ message: 'Order not found' })
    res.json(order)
  } catch (error) { res.status(500).json({ message: error.message }) }
})

module.exports = router