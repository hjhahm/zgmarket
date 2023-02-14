const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const saltRounds = 10

const userSchema = mongoose.Schema(
  {
    username: {
      type: String,
      maxLength: 20,
      unique: 1,
    },
    password: {
      type: String,
    },

    nickname: {
      type: String,
    },
    ageGroup: {
      //'20',
      type: String,
    },
    gender: {
      // 0: male, 1: female
      type: Number,
    },
    token: {
      type: String,
    },
    tokenExpiration: {
      type: Number,
    },
  },
  {
    versionKey: false,
  }
)

userSchema.pre('save', function (next) {
  // 비밀번호를 암호화 시킨다.
  // 유저모델을 저장하기 전에 콜백함수를 불러온다

  var user = this // userSchema를 가르키는 것
  if (user.isModified('password')) {
    bcrypt.genSalt(saltRounds, function (err, salt) {
      if (err) return next(err)
      bcrypt.hash(user.password, salt, function (err, hash) {
        if (err) return next(err)
        user.password = hash
        next()
      })
    })
  } else {
    next()
  }
})

userSchema.methods.comparePassword = function (plainPassword, callback) {
  bcrypt.compare(plainPassword, this.password, function (err, isMatch) {
    if (err) return callback(err)
    callback(null, isMatch)
  })
}

userSchema.methods.generateToken = function (callback) {
  var user = this
  var token = jwt.sign(user._id.toHexString(), 'secretToken')
  user.token = token
  user.save(function (err, user) {
    if (err) return callback(err)
    callback(null, user)
  })
}

userSchema.statics.findByToken = function (token, callback) {
  var user = this
  jwt.verify(token, 'secretToken', function (err, decoded) {
    //유저 아이디를 이용해서 유저를 찾은 다음에
    //클라이언트에서 가져온 token과 DB에 보관된 토큰이 일치하는지 확인
    user.findOne({ _id: decoded, token: token }, function (err, user) {
      if (err) return callback(err)
      callback(null, user)
    })
  })
}

const User = mongoose.model('User', userSchema)
module.exports = {
  User,
}
