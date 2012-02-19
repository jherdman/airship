EXAMPLES = spec/*_spec.js
REPORTER = spec

spec:
	@NODE_ENV=test ./node_modules/.bin/mocha \
		--require should \
		--require nock \
		--reporter $(REPORTER) \
		--growl \
		$(EXAMPLES)

coverage:
	@COV=1 $(MAKE) spec REPORTER=html-cov > coverage.html

.PHONY: spec coverage
