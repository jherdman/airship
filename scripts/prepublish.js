#!/usr/bin/env node

var fs = require('fs')
  , airship = require(__dirname + '/../index')
  , package = JSON.parse(fs.readFileSync(__dirname + '/../package.json'));

if (airship.version == package.version) {
  process.exit(0);
} else {
  console.log('Airship is version %s, and package is %s. Update and try again.', airship.version, package.version);
  process.exit(1);
}
