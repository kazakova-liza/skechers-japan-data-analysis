import { executeQuery } from './sql/executeQuery.js'
import groupBy from '../utils/groupBy.js'
import findKeyAccounts from './keyAccounts.js'
import addVas from './vas/addVas.js'


const createCartonsTable = async () => {
    const query = `SELECT carton, generatedDate, leaveDate, customer, printCode, soldTo, shipTo, wave, division, packedUnit, sku, left(wave, 8) as wdate
                    FROM japan2.orders`;

    const data = await executeQuery('getSpecificData', undefined, query);

    const dataWithVas = addVas(data);

    let bys = ['carton', 'generatedDate', 'leaveDate', 'customer', 'printCode', 'soldTo', 'shipTo', 'wave', 'division', 'inspection', 'shoeTag', 'shoeBoxLabel', 'cartonLabel'];
    let sums = ['packedUnit'];
    let dcnts = [];

    const grouppedData = groupBy(dataWithVas, bys, sums, dcnts);

    const keyAccounts = await findKeyAccounts(data);

    console.log(keyAccounts[0]);

    grouppedData.map((item) => {
        item.bom = -1
        const popDivisions = ['Y', 'Z', 'ZZ', 'YSF', 'YYM'];
        if (popDivisions.includes(item.division)) {
            item.cartonType = 'POP';
        }
        else if (item.division === 'YSO') {
            item.cartonType = 'SOCKS';
        }
        else if (item.carton in keyAccounts) {
            item.cartonType = 'key';
            item.bom = keyAccounts[item.carton]
        }
        else if (item.cnt === 1 && item.packedUnit_sum >= 6) {
            item.cartonType = 'FC';
        }
        else {
            item.cartonType = 'active';
        }
        const qty = item.packedUnit_sum
        var vasTime = 0
        if (item.inspection == '1') vasTime += qty * 60
        if (item.shoeTag == '1') vasTime += qty * 40
        if (item.shoeBoxLabel == '1') vasTime += qty * 15
        if (item.cartonLabel == '1') vasTime += 30
        item.vasTime = vasTime
    })

    const result = grouppedData.map((data) => {
        return [data.carton, data.generatedDate, data.leaveDate, data.customer, data.soldTo, data.printCode, data.shipTo, data.wave, data.cnt, data.packedUnit_sum, data.cartonType, data.bom, data.inspection, data.shoeTag, data.shoeBoxLabel, data.cartonLabel, data.vasTime];
    })

    const fields = 'carton, generatedDate, leaveDate, customer, soldTo, printCode, shipTo, wave, lines2, units, cartonType, bom, inspection,  shoeTag, shoeBoxLabel, cartonLabel, vasTime';
    const newTable = 'cartons';
    const query2 = `CREATE TABLE japan2.cartons (
  carton VARCHAR(45) NULL,
  generatedDate VARCHAR(45) NULL,
  leaveDate VARCHAR(45) NULL,
  customer VARCHAR(45) NULL,
  soldTo VARCHAR(45) NULL,
  printCode VARCHAR(45) NULL,
  shipTo  VARCHAR(45) NULL,
  wave  VARCHAR(45) NULL,
  lines2 INT NULL,
  units INT NULL,
  cartonType VARCHAR(45) NULL,
  bom INT NULL,
  inspection VARCHAR(45) NULL,
  shoeTag VARCHAR(45) NULL,
  shoeBoxLabel VARCHAR(45) NULL,
  cartonLabel  VARCHAR(45) NULL,
  vasTime INT NULL
  )`;

    await executeQuery('getSpecificData', newTable, query2);

    await executeQuery('write', newTable, undefined, result, fields);

    const query3 = `ALTER TABLE japan2.orders
    ADD INDEX carton (carton ASC) VISIBLE;`;

    const query4 = `ALTER TABLE japan2.cartons
    ADD INDEX carton (carton ASC) VISIBLE;`;

    await executeQuery('getSpecificData', newTable, query3);
    await executeQuery('getSpecificData', newTable, query4);


    const sql4 = `UPDATE orders INNER JOIN cartons ON orders.carton = cartons.carton SET orders.cartonType = cartons.cartonType `
    const res4 = await executeQuery('getSpecificData', undefined, sql4);
    console.log(res4)
}

createCartonsTable();