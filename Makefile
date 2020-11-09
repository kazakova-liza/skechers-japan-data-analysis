install:
	npm install

main:
	node src/server/main.js

server:
	node src/server/runServer.js

sku:
	node src/server/createSku.js

asn:
	node src/server/asn.js

publish:
	npm publish --dry-run

lint:
	npx eslint ./

lint-fix:
	npx eslint --fix ./

test:
	npm test

test-coverage:
	npm test -- --coverage --coverageProvider=v8