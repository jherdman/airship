var utils = require('../lib/utils');

describe('utils', function () {
  describe('#merge', function () {
    it('merges the properties of two objects into a new one', function () {
      var o1 = { foo: 'bar' }
        , o2 = { baz: 'qux' };

      utils.merge(o1, o2).should.have.keys('foo', 'baz');
    });

    it('merges three objects properties into a new one', function () {
      var o1 = { foo: 'bar' }
        , o2 = { baz: 'qux' }
        , o3 = { qui: 'abc' };

      utils.merge(o1, o2, o3).should.have.keys('foo', 'baz', 'qui');
    });

    it('does not attempt to merge a non-object', function () {
      (function () {
        utils.merge({ foo: 'bar' }, null);
      }).should.not.throw(/^TypeError/);
    });
  });

  describe('#tagPath', function () {
    it('builds a generic tags path', function () {
      utils.tagPath().should.eql('/api/tags/');
    });

    it('builds a tag path with a named tag', function () {
      utils.tagPath('bacon').should.eql('/api/tags/bacon');
    });
  });

  describe('#deviceTokenPath', function () {
    it('builds a generic device path', function () {
      utils.deviceTokenPath().should.eql('/api/device_tokens/');
    });

    it('builds a device path for a specific device', function () {
      utils.deviceTokenPath('CAFEBABE').should.eql('/api/device_tokens/CAFEBABE');
    });
  });

  describe('#deviceTokenTagPath', function () {
    it('builds a path for tags on a device', function () {
      utils.deviceTokenTagPath('CAFEBABE').should.eql('/api/device_tokens/CAFEBABE/tags/');
    });

    it('builds a path for a tag on a device', function () {
      utils.deviceTokenTagPath('CAFEBABE', 'bacon').should.eql('/api/device_tokens/CAFEBABE/tags/bacon');
    });
  });

  describe('#scheduledPushPath', function () {
    it('builds a path to a specific scheduled push message', function () {
      utils.scheduledPushPath('burp').should.eql('/api/push/scheduled/burp');
    });

    it('builds a path to the scheduled push end point', function () {
      utils.scheduledPushPath().should.eql('/api/push/scheduled/');
    });
  });
});
