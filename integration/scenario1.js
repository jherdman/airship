var key = process.argv[2]
  , secret = process.argv[3]
  , airship = require('../').createAirship(key, secret)
  , deviceToken = 'FE66489F304DC75B8D6E8200DFF8A456E8DAEACEC428B427E9518741C92C6660'
  , assert = require('assert');

/**
 * Simple integration scenario:
 *
 * 1. Register a device with tokens
 * 2. Remove a token
 * 3. Add another token
 */

var regReq = airship.register(deviceToken, { tags: ['bacon'] });

// Step 1
regReq.on('success', function (data) {
  console.log('Successfully registered device');

  // Step 2
  var remTokReq = airship.removeTag('bacon');

  remTokReq.on('success', function (data) {
    console.log('Successfully removed tag from device');

    // Step 3
    var addTokReq = airship.addTag('waffles');

    addTokReq.on('success', function (data) {
      console.log('Successfully added another token');
    });

    addTokReq.on('fail', function (err) {
      console.error('Failed to add another token');
      assert.ifError(err);
    });
  });

  remTokReq.on('fail', function (err) {
    console.error('Failed to remove tag');
    assert.ifError(err);
  });
});

regReq.on('fail', function (err) {
  console.error('Failed to register device');
  assert.ifError(err);
});
