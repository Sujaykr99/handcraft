const express = require('express')
const router = express.Router()
const Product = require('../models/Product')
const { protect, sellerOnly } = require('../middleware/auth')
const cloudinary = require('cloudinary').v2
const multer = require('multer')

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } })

// Upload image
router.post('/upload-image', protect, sellerOnly, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' })
    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: 'handart', transformation: [{ width: 800, quality: 'auto', fetch_format: 'auto' }] },
        (error, result) => { if (error) reject(error); else resolve(result) }
      )
      stream.end(req.file.buffer)
    })
    res.json({ url: result.secure_url })
  } catch (error) { res.status(500).json({ message: error.message }) }
})

// GET all products
router.get('/', async (req, res) => {
  try {
    const { category, search } = req.query
    let filter = {}
    if (category) filter.category = category
    if (search) filter.title = { $regex: search, $options: 'i' }
    const products = await Product.find(filter).populate('seller', 'name email').sort({ createdAt: -1 })
    res.json(products)
  } catch (error) { res.status(500).json({ message: error.message }) }
})

// GET seller's own products
router.get('/seller/my', protect, sellerOnly, async (req, res) => {
  try {
    const products = await Product.find({ seller: req.user.id }).sort({ createdAt: -1 })
    res.json(products)
  } catch (error) { res.status(500).json({ message: error.message }) }
})

// GET single product
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('seller', 'name email')
    if (!product) return res.status(404).json({ message: 'Product not found' })
    res.json(product)
  } catch (error) { res.status(500).json({ message: error.message }) }
})

// POST create product
router.post('/', protect, sellerOnly, async (req, res) => {
  try {
    const { title, description, price, category, image, stock, variants } = req.body
    const product = await Product.create({ seller: req.user.id, title, description, price, category, image, stock, variants })
    res.status(201).json(product)
  } catch (error) { res.status(500).json({ message: error.message }) }
})

// PUT update product
router.put('/:id', protect, sellerOnly, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
    if (!product) return res.status(404).json({ message: 'Product not found' })
    if (product.seller.toString() !== req.user.id) return res.status(403).json({ message: 'Not your product' })
    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true })
    res.json(updated)
  } catch (error) { res.status(500).json({ message: error.message }) }
})

// DELETE product
router.delete('/:id', protect, sellerOnly, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
    if (!product) return res.status(404).json({ message: 'Product not found' })
    if (product.seller.toString() !== req.user.id) return res.status(403).json({ message: 'Not your product' })
    await product.deleteOne()
    res.json({ message: 'Product deleted' })
  } catch (error) { res.status(500).json({ message: error.message }) }
})

module.exports = router