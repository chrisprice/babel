MAKEFLAGS = -j1

export NODE_ENV = test

.PHONY: build build-dist watch lint clean test-clean test-only test test-cov test-ci publish bootstrap

build:
	npm run build

build-dist:
	npm run build-dist

watch:
	npm run watch

lint:
	npm run lint

clean:
	npm run clean

test-clean:
	npm run test-clean

test-only:
	npm run test-only

test:
	npm test

test-cov:
	npm run test-cov

test-ci:
	npm run test-ci

publish:
	npm run publish

bootstrap:
	npm run bootstrap
