var u = require('./utils')
  , util = require('util')
  , https = require('https')
  , events = require('events')
  , DEFAULTS = { hostname: 'go.urbanairship.com' }
  , Request;

/**
 * Abstraction for doing requests. Mostly used to handle some assumptions about
 * dealing with UrbanAirship.
 *
 * Event: 'success'
 * `function (data) { }`
 *
 * Emitted each time there is a successful response. I.E. the response code is
 * 200, 201, or 204.
 *
 * Event: 'fail'
 * `function (err) { }`
 *
 * Emitted once for each request. No further events are emitted after this one.
 *
 * Event: 'close'
 * `function (err) { }`
 *
 * Underlying connection was terminated before the 'end' event.
 *
 * Event: 'error'
 * `function (err) { }`
 *
 * Emitted when there is a heinous error, such as trouble establishing a connection.
 *
 * @extends EventEmitter
 *
 * @private
 */
Request = function (options, data) {
  this.options = u.merge(DEFAULTS, options);
  this.data    = data;
};

util.inherits(Request, events.EventEmitter);

/**
 * Sets the authorization values for this request.
 *
 * @param {String} key The key for your application
 *
 * @param {String} secret They master secret for your application
 */
Request.prototype.setAuth = function (key, secret) {
  this.options.auth = [key, secret].join(':');
};

/**
 * @param {Object} data Data to send on the request. Automatically sets the
 *   content-type header to "application/json" when data is provided
 *
 * @return {http.ClientRequest}
 */
Request.prototype.apiCall = function (data) {
  var self = this
    , encodedData
    , req;

  req = https.request(this.options, function (res) {
    var chunks = []
      , statusCode = res.statusCode
      , contentType
      , responseBody
      , encodedData;

    res.setEncoding('utf8');

    res.on('data', function (chunk) {
      chunks.push(chunk);
    });

    res.on('end', function () {
      if (res.headers['content-type']) {
        responseBody = chunks.join('');
      }

      if (res.headers['content-type'].match(/application\/(.*)json/)) {
        responseBody = JSON.parse(responseBody);
      }

      if (res.statusCode >= 200 && res.statusCode < 300) {
        self.emit('success', responseBody);
      } else {
        self.emit('fail', responseBody);
      }
    });

    res.on('close', function (err) {
      self.emit('close', err);
    });
  });

  req.on('error', function (err) {
    self.emit('error', err);
  });

  if (typeof data !== 'undefined') {
    encodedData = JSON.stringify(data);

    req.setHeader('content-type', 'application/json');
    req.setHeader('content-length', encodedData.length);

    req.end(encodedData, 'utf8');
  } else {
    req.setHeader('content-length', 0);
    req.end();
  }

  return this;
};

/**
 * Sends an HTTP GET request. Automatically sets the 'accept' header for JSON
 *
 * @param {Object} options
 *
 * @see {request.send}
 */
Request.prototype.get = function () {
  this.options.method  = 'GET';
  this.options.headers = { 'accept': 'application/json' };
  return this.apiCall();
};

/**
 * Sends an HTTP PUT request. Any data sent is assumed to be JSON, which will
 * set the 'content-type' header accordingly.
 *
 * @param {Object} data JSON data to send in the request
 *
 * @see {request.send}
 */
Request.prototype.put = function (data) {
  this.options.method = 'PUT';
  return this.apiCall(data);
};

/**
 * Sends an HTTP DELETE request
 *
 * @param {Object} options
 *
 * @see {request.send}
 */
Request.prototype.delete = function () {
  this.options.method = 'DELETE';
  return this.apiCall();
};

/**
 * Sends an HTTP POST request. Sending data automatically sets the content-type
 * header for JSON.
 *
 * @param {Object} options
 *
 * @param {Object} data JSON data to send in the request
 *
 * @see {request.send}
 */
Request.prototype.post = function (data) {
  this.options.method = 'POST';
  return this.apiCall(data);
};

exports.Request = Request;
