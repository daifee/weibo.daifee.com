'use strict';

const { app, assert } = require('egg-mock/bootstrap');
const mock = require('../../mock');


describe('test/app/service/user.test.js', () => {
  before(async () => {
    await app.mongoose.connection.dropDatabase();

    const ctx = app.mockContext({});
    const { User } = ctx.model;
    await User.ensureIndexes();
  });

  describe('find(page, perPage)', () => {
    it('获取所有用户', async () => {
      await mock.createUsers(4);
      const ctx = app.mockContext();
      const users = await ctx.service.user.find({ page: 1, perPage: 3 });
      assert(users.length === 3);
    });
  });

  describe('create(userJson)', () => {
    it('创建新用户，成功', async () => {
      const ctx = app.mockContext({});
      const { User } = ctx.model;
      const data = mock.user();
      let user = new User(data);
      user = await ctx.service.user.create(user);

      assert.deepStrictEqual({
        phone: user.phone,
        name: user.name,
        status: user.status,
        role: user.role,
      }, {
        phone: data.phone,
        name: data.name,
        status: 'normal',
        role: 'normal',
      });

      assert(user.password !== data.password);
    });

    it('创建新用户，密码加密失败', async () => {
      const ctx = app.mockContext({});
      const { User } = ctx.model;
      try {
        await ctx.service.user.create(new User({
          phone: mock.string(11, '12345678932'),
        }));

        assert.fail('不应该运行到这里');
      } catch (err) {
        assert(err instanceof Error);
        assert(err.status === 501);
      }
    });

    it('创建新用户，数据验证失败', async () => {
      const ctx = app.mockContext({});
      const { User } = ctx.model;
      try {
        await ctx.service.user.create(new User({
          phone: '13246433455',
          password: '1345678',
        }));

        assert.fail('不应该运行到这里');
      } catch (err) {
        assert(err instanceof Error);
        assert(err.status === 400);
      }
    });

    it('创建新用户，重复创建', async () => {
      const ctx = app.mockContext({});
      const { User } = ctx.model;
      const data = mock.user();

      await ctx.service.user.create(new User(data));

      try {
        await ctx.service.user.create(new User(data));
        assert.fail('不应该运行到这里');
      } catch (err) {
        assert(err.status === 400);
        assert(err instanceof Error);
      }
    });
  });


  describe('findByPhone', () => {
    it('成功——找到用户', async () => {
      const data = await mock.createUser();

      const ctx = app.mockContext();
      const user = await ctx.service.user.findByPhone(data.phone);

      assert.deepStrictEqual({
        phone: data.phone,
      }, {
        phone: user.phone,
      });
    });

    it('查找不存在的用户', async () => {
      const ctx = app.mockContext();
      const phone = mock.string(11, '289384743');
      const user = await ctx.service.user.findByPhone(phone);

      assert(user === null);
    });

    it('不能找到已删除的用户', async () => {
      const data = await mock.createUser({ status: 'deleted' });

      const ctx = app.mockContext();
      const user = await ctx.service.user.findByPhone(data.phone);

      assert(user === null);
    });
  });


  describe('findById', () => {
    it('成功——找到用户', async () => {
      const data = await mock.createUser();

      const ctx = app.mockContext();
      const user = await ctx.service.user.findById(data.id);

      assert.deepStrictEqual({
        phone: data.phone,
      }, {
        phone: user.phone,
      });
    });

    it('不能找到已删除的用户', async () => {
      const data = await mock.createUser({ status: 'deleted' });
      const ctx = app.mockContext();

      const user = await ctx.service.user.findById(data.id);

      assert(user === null);
    });
  });
});
