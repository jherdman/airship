var expect = require('chai').expect
  , Airship = require('../lib/airship').Airship
  , airship = new Airship('foo', 'bar')
  , nock = require('nock')
  , uas = nock('https://go.urbanairship.com')
  , fs = require('fs')
  , fixture = function (name) {
      return __dirname + '/fixtures/' + name;
    };

describe('Airship', function () {
  describe('constructor', function () {
    it('sets the app key', function () {
      var a = new Airship('foo', 'bar');
      expect(a.appKey).to.eql('foo');
    });

    it('sets the master secret', function () {
      var a = new Airship('foo', 'bar');
      expect(a.masterSecret).to.eql('bar');
    });

    it('throws an error if an app key is not provided', function () {
      var fn = function () {
        var a = new Airship();
      };

      expect(fn).to.throw('You must provide an app key');
    });

    it('throws an error if a master secret is not provided', function () {
      var fn = function () {
        var a = new Airship('fooo');
      };

      expect(fn).to.throw('You must provide your master secret');
    });
  });

  describe('#deviceTokens', function () {
    var fixturePath = fixture('device_tokens.json');

    before(function () {
      uas
        .get('/api/device_tokens/')
          .replyWithFile(200, fixturePath, { 'content-type': 'application/json' })
        .get('/api/device_tokens/?page=1')
          .replyWithFile(200, fixturePath, { 'content-type': 'application/json' });
    });

    it('requests a page of device tokens', function () {
      airship.deviceTokens();
    });

    it('does not include a page number by default', function () {
      airship.deviceTokens({ page: 1 });
    });
  });

  describe('#tags', function () {
    before(function () {
      uas
        .get('/api/tags/')
        .replyWithFile(200, fixture('tags.json'), { 'content-type': 'application/json' });
    });

    it('requests the collection of tags', function () {
      airship.tags();
    });
  });

  describe('#addTag', function () {
    before(function () {
      uas
        .put('/api/tags/foobar')
        .reply(201, 'CREATED', { 'content-type': 'text/plain' });
    });

    it('requests to create a new tag', function () {
      airship.addTag('foobar');
    });
  });

  describe('#removeTag', function () {
    before(function () {
      uas
        .delete('/api/tags/foobar')
        .reply(204, 'NO CONTENT', { 'content-type': 'text/plain' });
    });

    it('requests to remove a tag', function () {
      airship.removeTag('foobar');
    });
  });

  describe('#modifyTokensOnTag', function () {
    before(function () {
      uas
        .post('/api/tags/pico', { device_tokens: { add: ['CAFEBABE'] } }, { 'content-type': 'application/json' })
        .reply(204, 'NO CONTENT', { 'content-type': 'text/plain' });
    });

    it('requests to modify device tokens on a tag', function () {
      airship.modifyTokensOnTag('pico', { device_tokens: { add: ['CAFEBABE'] } });
    });
  });

  describe('#deviceTags', function () {
    before(function () {
      uas
        .get('/api/device_tokens/CAFEBABE/tags/')
        .replyWithFile(200, fixture('device_tags.json'), { 'content-type': 'application/json' });
    });

    it('requests the collection of tags on a device', function () {
      airship.deviceTags('CAFEBABE');
    });
  });

  describe('#addTagToDevice', function () {
    before(function () {
      uas
        .put('/api/device_tokens/CAFEBABE/tags/fink')
        .reply(201, 'CREATED', { 'content-type': 'text/plain' });
    });

    it('requests to add a tag to a device', function () {
      airship.addTagToDevice('CAFEBABE', 'fink');
    });
  });

  describe('#removeTagFromDevice', function () {
    before(function () {
      uas
        .delete('/api/device_tokens/CAFEBABE/tags/fink')
        .reply(204, 'NO CONTENT', { 'content-type': 'text/plain' });
    });

    it('requests to remove a tag from a device', function () {
      airship.removeTagFromDevice('CAFEBABE', 'fink');
    });
  });

  describe('#register', function () {
    var data = { tags: ['foo', 'bar'] };

    before(function () {
      uas
        .put('/api/device_tokens/CAFEBABE')
          .reply(201, 'CREATED', { 'content-type': 'text/plain' })
        .put('/api/device_tokens/DEADBEEF', JSON.stringify(data), { 'content-type': 'application/json' })
          .reply(201, 'CREATED', { 'content-type': 'text/plain' });
    });

    it('requests to register a device', function () {
      airship.register('CAFEBABE');
    });

    it('requests to register a device with a payload', function () {
      airship.register('DEADBEEF', data);
    });
  });

  describe('#inactivate', function () {
    before(function () {
      uas
        .delete('/api/device_tokens/CAFEBABE')
        .reply(204, 'NO CONTENT', { 'content-type': 'text/plain' });
    });

    it('requests to inactive the device', function () {
      airship.inactivate('CAFEBABE');
    });
  });

  describe('#cancelPush', function () {
    var data = { cancel: ['https://go.urbanairship.com/api/push/scheduled/XX'] };

    before(function () {
      uas
        .delete('/api/push/scheduled/1234')
          .reply(204, 'NO CONTENT', { 'content-type': 'text/plain' })
        .post('/api/push/scheduled/', data, { 'content-type': 'application/json' })
          .reply(204, 'NO CONTENT', { 'content-type': 'text/plain' });
    });

    it('requests to cancel a scheduled push message', function () {
      airship.cancelPush('1234');
    });

    it('requests to cancel bulk scheduled push messages', function () {
      airship.cancelPush(data);
    });
  });

  describe('#batchPush', function () {
    var data = {};

    before(function () {
      uas
        .post('/api/push/batch/', JSON.stringify(data), { 'content-type': 'application/json' })
        .reply(200, 'OK', { 'content-type': 'text/plain' });
    });

    it('requests to send a batch push', function () {
      airship.batchPush(data);
    });
  });

  describe('#broadcast', function () {
    var data = {};

    before(function () {
      uas
        .post('/api/push/broadcast/', JSON.stringify(data), { 'content-type': 'application/json' })
        .reply(200, 'OK', { 'content-type': 'text/plain' });
    });

    it('requests to broadcast a message to all devices', function () {
      airship.broadcast(data);
    });
  });

  describe('#feedback', function () {
    var since = new Date('2011-5-19');

    before(function () {
      uas
        .get('/api/device_tokens/feedback/?since=' + since.toISOString())
        .replyWithFile(200, fixture('feedback.json'), { 'content-type': 'application/json' });
    });

    it('requests feedback from a point in time', function () {
      airship.feedback(since);
    });
  });
});
