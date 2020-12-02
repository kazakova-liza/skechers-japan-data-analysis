import { executeQuery } from './sql/executeQuery.js'


const createOrdersTable = async () => {
    const query1 = `SELECT a.carton, a.pickTicket, a.wave, a.pallet, b.style, b.color, b.size, b.sku, b.packedUnit, b.toBePick, c.soldTo, c.shipTo, c.orderType, c.carrier, c.printCode, c.generatedDate, c.leaveDate, c.stopShipDate, c.customer, c.division
FROM japan2.o_ctnHeader a
INNER JOIN japan2.o_ctnDetail b
ON a.carton = b.crtNumber
INNER JOIN japan2.o_ptHeader c
ON c.pickTicket = a.pickTicket`;

    const data = await executeQuery('getSpecificData', undefined, query1);
    console.log(data[0]);

    const result = data.map((item) => {
        return [item.carton, item.pickTicket, item.wave, item.pallet, item.style, item.color, item.size, item.sku, item.packedUnit, item.toBePick, item.soldTo, item.shipTo, item.orderType, item.carrier, item.printCode, item.generatedDate, item.leaveDate, item.stopShipDate, item.customer, item.division];
    })

    const fields = 'carton, pickTicket, wave, pallet, style, color, size, sku, packedUnit, toBePick, soldTo, shipTo, orderType, carrier, printCode, generatedDate, leaveDate, stopShipDate, customer, division';
    const newTable = 'orders';
    const query2 = `CREATE TABLE japan2.orders (
  carton VARCHAR(45) NULL,
  pickTicket VARCHAR(45) NULL,
  wave VARCHAR(45) NULL,
  pallet VARCHAR(45) NULL,
  style VARCHAR(45) NULL,
  color  VARCHAR(45) NULL,
  size  VARCHAR(45) NULL,
  sku VARCHAR(45) NULL,
  packedUnit INT NULL,
  toBePick INT NULL,
  soldTo VARCHAR(45) NULL,
  shipTo VARCHAR(45) NULL,
  orderType VARCHAR(45) NULL,
  carrier VARCHAR(45) NULL,
  printCode  VARCHAR(45) NULL,
  generatedDate VARCHAR(45) NULL,
  leaveDate VARCHAR(45) NULL,
  stopShipDate VARCHAR(45) NULL,
  customer VARCHAR(45) NULL,
  division VARCHAR(45) NULL,
  cartonType VARCHAR(45) NULL
  )`;

    await executeQuery('getSpecificData', newTable, query2);

    await executeQuery('write', newTable, undefined, result, fields);
}

createOrdersTable();