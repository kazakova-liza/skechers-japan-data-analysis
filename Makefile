main:
	node src/server/main.js

server:
	node src/server/runServer.js

sku:
	node src/server/createSku.js

orders:
	node src/server/orders.js

ostat:
	node src/server/ordersStats.js

type:
	node src/server/cartonTypes.js

affinity:
	node src/server/affinity.js

stat:
	node src/server/vas/vasStat.js

cust:
	node src/server/customers.js

cartons:
	node src/server/cartons.js

vas:
	node src/server/vas/vasStat.js

key:
	node src/server/keyAccounts.js

receiving:
	node src/server/inbound/receivingStats.js

returns:
	node src/server/dailyReturns.js

shipments:
	node src/server/shipments.js

lint:
	npx eslint ./

lint-fix:
	npx eslint --fix ./
