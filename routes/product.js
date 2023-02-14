const express = require('express')
const router = express.Router()
const { createProduct } = require('../controller/product')

//====================================
//             Create Product
//====================================
router.post('/', createProduct)
