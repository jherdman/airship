var expect = require('chai').expect
  , utils = require('../lib/utils');

describe('utils', function () {
  describe('#merge', function () {
    it('merges the properties of two objects into a new one', function () {
      var o1 = { foo: 'bar' }
        , o2 = { baz: 'qux' }
        , result = utils.merge(o1, o2);

      expect(result).to.have.ownProperty('foo');
      expect(result).to.have.ownProperty('baz');
    });

    it('merges three objects properties into a new one', function () {
      var o1 = { foo: 'bar' }
        , o2 = { baz: 'qux' }
        , o3 = { qui: 'abc' }
        , result = utils.merge(o1, o2, o3);

      expect(result).to.have.ownProperty('foo');
      expect(result).to.have.ownProperty('baz');
      expect(result).to.have.ownProperty('qui');
    });

    it('does not attempt to merge a non-object', function () {
      var fn = function () {
        utils.merge({ foo: 'bar' }, null);
      };

      expect(fn).to.not.throw(/^TypeError/);
    });
  });

  describe('#tagPath', function () {
    it('builds a generic tags path', function () {
      expect(utils.tagPath()).to.eql('/api/tags/');
    });

    it('builds a tag path with a named tag', function () {
      expect(utils.tagPath('bacon')).to.eql('/api/tags/bacon');
    });
  });

  describe('#deviceTokenPath', function () {
    it('builds a generic device path', function () {
      expect(utils.deviceTokenPath()).to.eql('/api/device_tokens/');
    });

    it('builds a device path for a specific device', function () {
      expect(utils.deviceTokenPath('CAFEBABE')).to.eql('/api/device_tokens/CAFEBABE');
    });
  });

  describe('#deviceTokenTagPath', function () {
    it('builds a path for tags on a device', function () {
      expect(utils.deviceTokenTagPath('CAFEBABE')).to.eql('/api/device_tokens/CAFEBABE/tags/');
    });

    it('builds a path for a tag on a device', function () {
      expect(utils.deviceTokenTagPath('CAFEBABE', 'bacon')).to.eql('/api/device_tokens/CAFEBABE/tags/bacon');
    });
  });

  describe('#scheduledPushPath', function () {
    it('builds a path to a specific scheduled push message', function () {
      expect(utils.scheduledPushPath('burp')).to.eql('/api/push/scheduled/burp');
    });

    it('builds a path to the scheduled push end point', function () {
      expect(utils.scheduledPushPath()).to.eql('/api/push/scheduled/');
    });
  });
});
