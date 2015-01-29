var expect = require('chai').expect
  , uas = require('../lib/index')
  , Airship = require('../lib/airship').Airship;

describe('Main public interface', function () {
  it('creates an Airship instance', function () {
    var airship = uas.createAirship('foo', 'bar');
    expect(airship).to.be.instanceOf(Airship);
  });
});
