/**
 * 标签
 */
'use strict';

module.exports = app => {
  const { mongoose } = app;

  const schema = new mongoose.Schema({
    name: {
      type: String,
      index: true, // 索引
      unique: true,
      required: true,
      maxlength: [ 10, '标签名不能超过10个字符' ],
    },
    description: {
      type: String,
      maxlength: [ 240, '标签描述不能超过140个字符' ],
    },
    // 状态
    status: {
      type: String,
      default: 'normal',
      // 正常，已删除
      enum: [ 'normal', 'deleted' ],
    },
  }, {
    timestamps: true,
  });

  return mongoose.model('Label', schema);
};
