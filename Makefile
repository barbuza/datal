TS_FILES := $(wildcard src/*.ts)

lib/index.js: $(TS_FILES)
	./node_modules/typescript/bin/tsc -m commonjs --outDir lib --removeComments $^

clean:
	rm -f $(TS_FILES:src/%.ts=lib/%.js)

test: lib/index.js
	./node_modules/.bin/nodeunit tests
