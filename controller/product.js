const Product = require('../model/Product')
const asyncHandler = require('express-async-handler')

// [POST] /product
const createProduct = asyncHandler(async (req, res) => {
  const { title, price, image, category, shop } = req.body

  // Validate request
  if (!title) {
    res.status(400).send({
      message: 'Title is empty!',
    })
    return
  }

  {
    // Set Product
    const product = new Product({
      title,
      price,
      image,
      category,
      shop,
    })

    Product.create(product)
      .then(data => {
        res.send(data)
      })
      .catch(err => {
        res.status(500).send({
          message: err.message || 'Create tutorial failure.',
        })
      })

    // await product.save()

    // res.status(201).json(create)
  }
})

// [GET] /
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
