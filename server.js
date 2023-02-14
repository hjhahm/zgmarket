// const express = require('express')
// const app = express()

// app.set('view engine', 'ejs')

// app.use('/member', require('./routes/member.js'))

// app.listen(8080, () => {
//   console.log('server on')
// })

// app.get('/', (req, res) => {
//   res.render('index.ejs')
// })

const MongoClient = require('mongodb').MongoClient

let db
const db_url = ''
