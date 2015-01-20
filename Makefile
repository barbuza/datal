export PATH := ./node_modules/.bin:$(PATH)

datal.js: index.ts
	PATH=$$PATH tsc -m commonjs --sourceMap -d --removeComments $^

clean:
	rm -rf datal.js datal.js.map datal.d.ts dist

test: datal.js
	PATH=$$PATH nodeunit tests

browser:
	mkdir -p dist
	PATH=$$PATH browserify -g uglifyify -s datal index.ts -p tsify --target=ES5 -d | exorcist dist/datal.browser.min.js.map > dist/datal.browser.min.js

release: datal.js test browser browser
