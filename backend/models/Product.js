const mongoose = require('mongoose')

const variantSchema = new mongoose.Schema({
  size: String,
  color: String,
  price: Number,
  stock: { type: Number, default: 0 }
})

const productSchema = new mongoose.Schema({
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  image: { type: String, default: '' },
  stock: { type: Number, default: 0 },
  variants: [variantSchema]
}, { timestamps: true })

module.exports = mongoose.model('Product', productSchema)