'use strict';

const { Service } = require('egg');

class LabelService extends Service {

  async create(model) {
    const { Label } = this.ctx.model;
    const label = await Label.create(model);
    return label;
  }

  async update(id, obj) {
    const { Label } = this.ctx.model;

    const query = Label.find({})
      .findOneAndUpdate({ _id: id }, obj, { new: true });

    const label = await query.exec();

    return label;
  }

  async delete(id) {
    const { Label } = this.ctx.model;

    return await this.update(id, new Label({ status: 'deleted' }));
  }

  /**
   * 查找所有标签
   * @return {Array} 标签集合
   */
  async find() {
    const { Label } = this.ctx.model;
    const query = Label.find({})
      .find({ status: { $ne: 'deleted' } });

    return await query.exec();
  }
}

module.exports = LabelService;