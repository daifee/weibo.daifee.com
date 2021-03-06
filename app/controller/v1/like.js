'use strict';

const ApiController = require('../../core/api-controller');

class LikeController extends ApiController {
  async list() {
    const { params, service } = this.ctx;

    this.assertUser(params.userId);

    const likes = await service.like.find(params.userId, this.page, this.perPage);
    this.echo(likes);
  }

  async create() {
    const { params, request, model, service } = this.ctx;
    this.assertUser(params.userId);

    const doc = new model.Like({
      userId: params.userId,
      targetId: request.body.targetId,
    });

    const error = doc.validateSync('userId targetId');
    this.assert(!error, 400, (error && error.message), { error });

    const like = await service.like.create(params.userId, doc);
    this.echo(like);
  }

  async delete() {
    const { ctx } = this;
    const { params, service } = ctx;

    this.assertUser(params.userId);

    const result = await service.like.delete(params.userId, params.likeId);
    this.echo(result);
  }
}

module.exports = LikeController;
