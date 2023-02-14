const mongoose = require('mongoose')

const ProductSchema = mongoose.Schema(
  {
    title: {
      type: String,
      maxLength: 100,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: false,
    },
    image: {
      type: String,
    },
    shop: {
      type: String,
    },
    category: {
      type: String,
    },
    stock: {
      type: Number,
      default: 100,
      required: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
)

module.exports = mongoose.model('Product', ProductSchema)
