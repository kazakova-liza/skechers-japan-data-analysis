main:
	node src/server/main.js

server:
	node src/server/runServer.js

sku:
	node src/server/createSku.js

orders:
	node src/server/orders.js

asn:
	node src/server/asn.js

affinity:
	node src/server/affinity.js

vas:
	node src/server/vas.js

cust:
	node src/server/customers.js

cartons:
	node src/server/cartons.js

key:
	node src/server/keyAccounts.js

receiving:
	node src/server/dailyReceving.js

returns:
	node src/server/dailyReturns.js

shipments:
	node src/server/shipments.js

lint:
	npx eslint ./

lint-fix:
	npx eslint --fix ./
