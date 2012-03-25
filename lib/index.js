var Airship = require('./airship').Airship;

/**
 * @param {String} appKey Your unique application key
 *
 * @param {String} secret Your application's master secret
 *
 * @return {Airship} a new Airship instance
 */
exports.createAirship = function (appKey, masterSecret) {
  return new Airship(appKey, masterSecret);
};

exports.version = '0.1.1';
