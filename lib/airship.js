var u = require('./utils')
  , Request = require('./request').Request
  , Airship;

Airship = function (appKey, masterSecret) {
  if (!appKey) { throw new Error('You must provide an app key'); }
  if (!masterSecret) { throw new Error('You must provide your master secret'); }

  this.appKey = appKey;
  this.masterSecret = masterSecret;
};

Airship.prototype = {
  /**
   * @private
   */
  request: function (options) {
    var req = new Request(options);
    req.setAuth(this.appKey, this.masterSecret);
    return req;
  }
  /**
   * @param {Object} options Use to set the page number of results you want
   *
   * @see http://urbanairship.com/docs/push.html#device-token-list-api
   */
, deviceTokens: function (options) {
    var path = u.deviceTokenPath();

    if (options && options.page) {
      path += '?page=' + options.page;
    }

    return this.request({ path: path }).get();
  }
  /**
   * @see http://urbanairship.com/docs/tags.html#seeing-your-tags
   */
, tags: function () {
    return this.request({ path: u.tagPath() }).get();
  }
  /**
   * @param {String} tagName the name of the tag to add to the application
   *
   * @see http://urbanairship.com/docs/tags.html#adding-tags
   */
, addTag: function (tagName) {
    return this.request({ path: u.tagPath(tagName) }).put();
  }
  /**
   * @param {String} tagName the name of the tag to remove from the application
   *
   * @see http://urbanairship.com/docs/tags.html#removing-tags
   */
, removeTag: function (tagName) {
    return this.request({ path: u.tagPath(tagName) }).delete();
  }
  /**
   * @param {String} tagName the name of the tag to modify
   *
   * @param {Object} payload a JavaScript object describing how to modify the tag
   *
   * @see http://urbanairship.com/docs/tags.html#modifying-device-tokens-on-a-tag
   */
, modifyTokensOnTag: function (tagName, payload) {
    return this.request({ path: u.tagPath(tagName) }).post(payload);
  }
  /**
   * @param {String} deviceToken the token for the Device of interest
   */
, deviceTags: function (deviceToken) {
    return this.request({ path: u.deviceTokenTagPath(deviceToken) }).get();
  }
  /**
   * @param {String} deviceToken the token for the Device of interest
   *
   * @param {String} tag the tag to add to the Device
   */
, addTagToDevice: function (deviceToken, tag) {
    return this.request({ path: u.deviceTokenTagPath(deviceToken, tag) }).put();
  }
  /**
   * @param {String} deviceToken the token for the Device of interest
   *
   * @param {String} tag the tag to remove from the Device
   */
, removeTagFromDevice: function (deviceToken, tag) {
    return this.request({ path: u.deviceTokenTagPath(deviceToken, tag) }).delete();
  }
  /**
   * @param {String} deviceToken the token of the Device to register
   *
   * @param {Object} payload The optional payload of options to initialize the
   *                         Device with
   *
   * @see http://urbanairship.com/docs/push.html#registration
   */
, register: function (deviceToken, payload) {
    return this.request({ path: u.deviceTokenPath(deviceToken) }).put(payload);
  }
  /**
   * Inactive a device
   *
   * @param {String} deviceToken the token of the Device to inactivate
   *
   * @see http://urbanairship.com/docs/push.html#registration
   */
, inactivate: function (deviceToken) {
    return this.request({ path: u.deviceTokenPath(deviceToken) }).delete();
  }
  /**
   * Send a push message
   *
   * @param {Object} payload describes the push message to send
   *
   * @see http://urbanairship.com/docs/push.html#push
   */
, push: function (payload) {
    return this.request({ path: '/api/push/' }).post(payload);
  }
  /**
   * Cancel a single push message, or many
   *
   * @param {Object, String} idOrArgs Either the payload describing the bulk
   *                         or the ID of the specific message to send
   *
   * @see http://urbanairship.com/docs/push.html#scheduled-notifications
   */
, cancelPush: function (idOrArgs) {
    var req = this.request({ path: u.scheduledPushPath(idOrArgs) });

    if (typeof idOrArgs == 'object') {
      return req.post(idOrArgs);
    } else {
      return req.delete();
    }
  }
  /**
   * Send a batch push message request
   *
   * @param {Object} payload
   *
   * @see http://urbanairship.com/docs/push.html#batch-push
   */
, batchPush: function (payload) {
    return this.request({ path: '/api/push/batch/' }).post(payload);
  }
  /**
   * Broadcast a message to all registered devices
   *
   * @param {Object} payload
   *
   * @see http://urbanairship.com/docs/push.html#broadcast
   */
, broadcast: function (payload) {
    return this.request({ path: '/api/push/broadcast/' }).post(payload);
  }
  /**
   * Get feedback regarding usage
   *
   * @param {Date} since The point in time from which you want feedback
   *
   * @see http://urbanairship.com/docs/push.html#feedback-service
   */
, feedback: function (since) {
    var path = u.deviceTokenPath() + 'feedback/?since=' + since.toISOString();
    return this.request({ path: path }).get();
  }
};

exports.Airship = Airship;
