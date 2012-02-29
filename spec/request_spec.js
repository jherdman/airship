var Request = require('../lib/request').Request
  , nock = require('nock')
  , dummyService = nock('https://go.urbanairship.com');

describe('Request', function () {
  describe('#setAuth', function () {
    it('sets the auth params to the options', function () {
      var req = new Request({});
      req.setAuth('foo', 'bar');
      req.options.auth.should.eql('foo:bar');
    });
  });

  describe('#apiCall', function () {
    before(function () {
      dummyService
        .get('/okay')
          .reply(200, 'OKAY', { 'content-type': 'text/plain' })
        .get('/json')
          .reply(200, { 'my': 'data' }, { 'content-type': 'application/json' }) 
        .get('/fail')
          .reply(500, 'CLIENT ERROR', { 'content-type': 'text/plain' })
        .get('/data')
          .reply(200, 'DATA', { 'content-type': 'text/plain' })
        .get('/yupyup')
          .reply(200, 'OKAY', { 'content-type': 'text/plain' });
    });

    it('emits a "success" event when request successful', function (done) {
      var req = new Request({ path: '/okay' });
      req.options.method = 'GET';

      req.on('success', function (d) {
        d.should.eql('OKAY');
        done();
      });

      req.apiCall();
    });

    it('emits a "success" event with parsed JSON data when successful', function (done) {
      var req = new Request({ path: '/json' });
      req.options.method = 'GET';

      req.on('success', function (d) {
        d.should.eql({ my: 'data' });
        done();
      });

      req.apiCall();
    });

    it('emits a "fail" event when request fails', function (done) {
      var req = new Request({ path: '/fail' });
      req.options.method = 'GET';

      req.on('fail', function (d) {
        d.should.eql('CLIENT ERROR');
        done();
      });

      req.apiCall();
    });

    it('returns the instance', function () {
      var req = new Request({ path: '/yupyup' });
      req.options.method = 'GET';
      req.apiCall().should.be.instanceof(Request);
    });
  });

  describe('#put', function () {
    before(function () {
      dummyService
        .put('/foo')
          .reply(201, 'CREATED', { 'content-type': 'text/plain' })
        .put('/bar', { my: 'data' }, { 'content-type': 'application/json' })
          .reply(201, 'CREATED', { 'content-type': 'text/plain' })
        .put('/pickle')
          .reply(201, 'CREATED', { 'content-type': 'text/plain' });
    });

    it('sends a PUT request to an end point', function () {
      var req = new Request({ path: '/foo' });
      req.put();
    });

    it('sends a PUT request with a JSON body', function () {
      var req = new Request({ path: '/bar' });
      req.put({ my: 'data' });
    });

    it('returns the instance', function () {
      var req = new Request({ path: '/pickle' });
      req.put().should.be.instanceof(Request);
    });
  });

  describe('#post', function () {
    before(function () {
      dummyService
        .post('/foo')
          .reply(200, 'OK', { 'content-type': 'text/plain' })
        .post('/bar', { 'my': 'data' }, { 'content-type': 'application/json' })
          .reply(200, 'OK', { 'content-type': 'text/plain' })
        .post('/spoon')
          .reply(200, 'OK', { 'content-type': 'text/plain' });
    });

    it('sends a POST request to an end point', function () {
      var req = new Request({ path: '/foo' });
      req.post();
    });

    it('sends a POST request with a JSON body', function () {
      var req = new Request({ path: '/bar' });
      req.post({ my: 'data' });
    });

    it('returns the instance', function () {
      var req = new Request({ path: '/spoon' });
      req.post().should.be.instanceof(Request);
    });
  });

  describe('#get', function () {
    before(function () {
      dummyService
        .get('/baz')
          .reply(200, 'OK', { 'content-type': 'text/plain' })
        .get('/bark')
          .reply(200, 'OK', { 'content-type': 'text/plain' });
    });

    it('sends a GET request', function () {
      var req = new Request({ path: '/baz' });
      req.get();
    });

    it('returns the instance', function () {
      var req = new Request({ path: '/bark' });
      req.get().should.be.instanceof(Request);
    });
  });

  describe('#delete', function () {
    before(function () {
      dummyService
        .delete('/quz')
          .reply(204, 'NO CONTENT', { 'content-type': 'text/plain' })
        .delete('/bat')
          .reply(204, 'NO CONTENT', { 'content-type': 'text/plain' });
    });

    it('sends a DELETE request', function () {
      var req = new Request({ path: '/quz' });
      req.delete();
    });

    it('returns the instance', function () {
      var req = new Request({ path: '/bat' });
      req.delete().should.be.instanceof(Request);
    });
  });
});
