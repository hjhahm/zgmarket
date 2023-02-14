const express = require('express')
const router = express.Router()
const { getHtml } = require('../util/crawler')

//=================================
//             Crwaler API
//=================================

router.get('/c/:name', (req, res) => {
  const name = req.params.name
  getHtml(name)
  
})

module.exports = router
