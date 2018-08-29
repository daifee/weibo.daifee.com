'use strict';

const { Service } = require('egg');

class PictureService extends Service {
  // 创建图片
  async create(doc) {
    const { Picture } = this.ctx.model;
    let picture;

    try {
      picture = await Picture.create(doc);
    } catch (error) {
      if (error.code === 11000) {
        this.ctx.throw(400, '重复发布改图片', { error });
      } else if (error.name === 'ValidationError') {
        this.ctx.throw(400, error.message, { error });
      } else {
        this.ctx.throw(503, error.message, { error });
      }
    }

    return picture;
  }

  // 更新
  async update(id, obj) {
    const query = this.ctx.model.Picture.find({})
      .findOneAndUpdate({ _id: id }, obj, { new: true });

    let result;
    try {
      result = await query.exec();
    } catch (error) {
      if (error.code === 11000) {
        this.ctx.throw(400, '重复发布', { error });
      } else if (error.name === 'ValidationError') {
        this.ctx.throw(400, error.message, { error });
      } else {
        this.ctx.throw(503, error.message, { error });
      }
    }

    return result;
  }

  // 删除
  async delete(id) {
    const { Picture } = this.ctx.model;
    const query = Picture.find({})
      .update({ _id: id }, { status: 'deleted' });

    const result = await query.exec();
    return !!result.ok;
  }

  // 查找，分页
  async find(page = 1, perPage = 10) {
    const query = this.ctx.model.Picture.find({})
      .find({ status: { $ne: 'deleted' } })
      .skip((page - 1) * perPage)
      .limit(perPage);

    return query.exec();
  }
}

module.exports = PictureService;
