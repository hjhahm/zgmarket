const express = require('express')
const router = express.Router()
const { createProduct, getProducts } = require('../controller/product')

//====================================
//             Create Product
//====================================
router.post('/', createProduct)

router.get('/', getProducts)

module.exports = router
