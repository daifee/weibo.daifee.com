'use strict';

const { app } = require('egg-mock/bootstrap');

exports.stringId = function() {
  return app.mongoose.Types.ObjectId().toString();
};

exports.int = function(min = 0, max = 999999) {
  const range = max - min;
  const result = range * Math.random() + min;

  return Math.floor(result);
};

exports.string = function(len = 9, seed = '发窘啊876发达奇偶') {
  const result = [];
  let index;
  while (result.length < len) {
    index = exports.int(0, seed.length);
    result.push(seed[index]);
  }

  return result.join('');
};


exports.user = function(user = {}) {
  const id = exports.stringId();
  return Object.assign({
    _id: id,
    id,
    name: exports.string(),
    password: exports.string(7, 'fjaio*7f^&fda324'),
    phone: exports.string(11, '123456789'),
  }, user);
};

exports.label = function(label = {}) {
  const user = exports.user();
  return Object.assign({
    userId: user.id,
    name: exports.string(6),
    description: exports.string(32),
  }, label);
};

exports.picture = function(picture = {}) {
  const user = exports.user();
  return Object.assign({
    url: exports.string(12),
    userId: user.id,
  }, picture);
};

exports.microBlog = function(microBlog = {}) {
  const user = exports.user();
  return Object.assign({
    userId: user.id,
    pictureUrls: [
      exports.string(12),
      exports.string(11),
      exports.string(13),
      exports.string(10),
    ],
    type: 'picture',
    text: exports.string(11),

  }, microBlog);
};

exports.like = function(like = {}) {
  const user = exports.user();
  const picture = exports.picture();
  return Object.assign({
    userId: user.id,
    type: 'picture',
    targetId: picture.url,
  }, like);
};


exports.createUser = async function(user = {}) {
  const arr = await exports.createUsers(1, user);
  return arr[0];
};


exports.createUsers = async function(num = 1, user = {}) {
  const ctx = app.mockContext({});
  const { User } = ctx.model;

  const data = loop(() => {
    const data = exports.user(user);
    const doc = new User(data);
    doc.encryptPassword();
    return doc;
  }, num);

  return await User.create(data);
};


exports.createLabel = async function(label = {}) {
  const arr = await exports.createLabels(1, label);
  return arr[0];
};


exports.createLabels = async function(num = 1, label = {}) {
  const ctx = app.mockContext({});
  const { Label } = ctx.model;

  const data = loop(() => exports.label(label), num);
  return await Label.create(data);
};


exports.createPicture = async function(picture = {}) {
  const arr = await exports.createPictures(1, picture);
  return arr[0];
};

exports.createPictures = async function(num = 1, picture = {}) {
  const ctx = app.mockContext({});
  const { Picture } = ctx.model;

  const data = loop(() => exports.picture(picture), num);
  return await Picture.create(data);
};

exports.createMicroBlog = async function(microBlog = {}) {
  const arr = await exports.createMicroBlogs(1, microBlog);
  return arr[0];
};

exports.createMicroBlogs = async function(num = 1, microBlog = {}) {
  const ctx = app.mockContext({});
  const { MicroBlog } = ctx.model;
  const data = loop(() => exports.microBlog(microBlog), num);
  return await MicroBlog.create(data);
};

exports.createLike = async function(like = {}) {
  const arr = await exports.createLikes(1, like);
  return arr[0];
};

exports.createLikes = async function(num = 1, like = {}) {
  const ctx = app.mockContext({});
  const { Like } = ctx.model;
  const data = loop(() => exports.like(like), num);
  return await Like.create(data);
};


function loop(cb, times = 0) {
  const result = [];
  for (let i = 0; i < times; i++) {
    result.push(cb());
  }

  return result;
}

exports.createApiController = async function() {
  await app.ready();
  return app.controller.admin.label;
};

exports.createViewController = async function() {
  await app.ready();
  return app.controller.home;
};

