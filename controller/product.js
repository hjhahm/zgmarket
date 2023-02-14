const Product = require('../models/Product')
const asyncHandler = require('express-async-handler')

// [POST] /product
const create = asyncHandler(async (req, res) => {
  const { title, price, image, category, shop } = req.body

  //   if (orderItems && orderItems.length === 0) {
  //     res.status(400)
  //     throw new Error('No items in the cart')
  //     return
  //   } else
  {
    const product = new Product({
      title,
      price,
      image,
      category,
      shop,
    })

    const createProduct = await product.save()

    res.status(201).json(create)
  }
})

// [GET] /products
const getProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({})

  res.json(products)
})

// [GET] /products/:id
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id)

  if (product) {
    res.json(product)
  } else {
    res.status(404)
    throw new Error('Product Not Found')
  }
})

module.exports = { getProducts, getProductById, createProduct }
