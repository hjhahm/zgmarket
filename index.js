const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const app = express()
const config = require('./config/key')

// 공통
const memberRouter = require('./routes/member')
// 당근
//const boardRouter = require('./routes/board')
//const commentRouter = require('./routes/comment')
//  직잭
const shopRouter = require('./routes/shop')
const productRouter = require('./routes/product')
//const likeRouter = require('./routes/like')

//const userRouter = require('./routes/user')
//const authRouter = require('./routes/auth')

const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const connect = mongoose
  .connect('mongodb://localhost:27017/zigmarket', {
    auth: { authSource: 'admin' },
    user: 'cheese',
    pass: 'c1c1c1',
  })
  // const connect = mongoose
  //   .connect(config.mongoURI, {
  //     // db 연결
  //     useNewUrlParser: true,
  //     useUnifiedTopology: true,
  //   })
  .then(() => console.log('MongoDB connected!'))
  .catch(err => console.log(err))

app.use(bodyParser.urlencoded({ extended: true })) // bodyParser를 express로 대체가능
app.use(bodyParser.json())
app.use(cookieParser())

app.use('/member', memberRouter)
app.use('/shop', shopRouter)
app.use('/product', productRouter)

//app.use('/board', boardRouter)

// app.use('/comment', commentRouter)
// app.use('/like', likeRouter)
// app.use('/user', userRouter)
// app.use('/auth', authRouter)

const port = 8080
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
