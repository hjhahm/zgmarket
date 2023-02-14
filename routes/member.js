const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const { User } = require('../model/User')
const userController = require('../controller/user')

//=================================
//             Login
//=================================

router.post('/login', (req, res) => {
  User.findOne({ username: req.body.username }, (err, user) => {
    if (!user) {
      return res.json({
        loginSuccess: false,
        message: '제공된 아이디에 해당되는 유저가 없습니다.!!',
      })
    }
    user.comparePassword(req.body.password, (err, isMatch) => {
      if (!isMatch)
        return res.json({
          loginSuccess: false,
          message: '비밀번호가 틀렸습니다.',
        })
      user.generateToken((err, user) => {
        user.password = null
        if (err) return res.status(400).send(err)
        res.cookie('x_authExp', user.tokenExp)
        res.cookie('x_auth', user.token).status(200).json({
          loginSuccess: true,
          user: user,
        })
      })
    })
  })
})

//=================================
//             Register
//=================================

router.post('/register', (req, res) => {
  const user = new User(req.body)
  user.save((err, user) => {
    if (err)
      return res.json({
        success: false,
        message: err,
      })
    return res.status(200).json({
      success: true,
    })
  })
})

router.post('/check/username', (req, res) => {
  User.findOne({ username: req.body.username }, (err, user) => {
    if (!user) return res.status(200).send()
    else
      return res.status(404).json({
        success: false,
      })
  })
})
// router.get('/', auth, (req, res) => {
//   User.findOne({ _id: req.user._id }, (err, user) => {
//     if (user)
//       return res.status(200).json({
//         id: req.user.id,
//         nickname: req.user.nickname,
//       })
//     else return res.status(404).send()
//   })
// })

module.exports = router
