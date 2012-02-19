var utils = exports;

utils.merge = function () {
  var objects = Array.prototype.slice.call(arguments)
    , merged = {};

  objects.forEach(function (obj) {
    Object.getOwnPropertyNames(obj).forEach(function (prop) {
      merged[prop] = obj[prop];
    });
  });

  return merged;
};

utils.deviceTokenPath = function (deviceToken) {
  var root = '/api/device_tokens/';
  return (deviceToken ? [root, deviceToken].join('') : root);
};

utils.tagPath = function (tagName) {
  var root = '/api/tags/';
  return (tagName ? [root, tagName].join('') : root);
};

utils.deviceTokenTagPath = function (deviceToken, tagName) {
  var root = ['/api/device_tokens/', deviceToken, '/tags/'].join('');
  return (tagName ? [root, tagName].join('') : root);
};

utils.scheduledPushPath = function (id) {
  var root = '/api/push/scheduled/';
  return (id && (typeof id !== 'object') ? [root, id].join('') : root);
};
