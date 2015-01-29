EXAMPLES = spec/*_spec.js
REPORTER = spec

spec:
	@NODE_ENV=test ./node_modules/.bin/mocha \
		--require nock \
		--reporter $(REPORTER) \
		--growl \
		$(EXAMPLES)

.PHONY: spec
