main:
	node src/server/main.js

server:
	node src/server/runServer.js

sku:
	node src/server/createSku.js

asn:
	node src/server/asn.js

receiving:
	node src/server/dailyReceving.js

returns:
	node src/server/dailyReturns.js

lint:
	npx eslint ./

lint-fix:
	npx eslint --fix ./
