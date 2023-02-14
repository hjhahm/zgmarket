const mongoose = require('mongoose')

const ShopSchema = mongoose.Schema(
  {
    name: {
      type: String,
      maxLength: 15,
      unique: 1,
    },
    enName: {
      type: String,
      maxLength: 30,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    tag: {
      ageGroup: {
        type: Array,
        default: [],
      },
      gender: {
        type: Array,
        default: [],
      },
      style: {
        type: Array,
        default: [],
      },
    },
  },
  {
    versionKey: false,
  }
)

ShopSchema.pre('save', function (next) {
  //   if (!this.email) {
  //     // email 필드가 없으면 에러 표시 후 저장 취소
  //     throw '이메일이 없습니다'
  //   }
  //   if (!this.createdAt) {
  //     // createdAt 필드가 없으면 추가
  //     this.createdAt = new Date()
  //   }
  next()
})

ShopSchema.post('find', function (result) {
  console.log('저장 완료', result)
})
